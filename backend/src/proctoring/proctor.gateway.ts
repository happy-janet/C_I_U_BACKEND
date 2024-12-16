import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

interface RoomData {
  students: Map<
    string,
    {
      studentId: string;
      lastActive: Date;
    }
  >;
  proctors: Set<string>;
}

@Injectable()
@WebSocketGateway({
  namespace: 'proctor',
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ProctorGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private prisma: PrismaService) {}

  @WebSocketServer()
  server: Server;

  private rooms: Map<string, RoomData> = new Map();

  @SubscribeMessage('get-active-exams')
  async handleGetActiveExams() {
    const now = new Date();
    try {
      const activeExams = await this.prisma.addAssessment.findMany({
        where: {
          isDraft: false,
          startTime: { lte: now },
          endTime: { gte: now },
        },
        select: {
          id: true,
          title: true,
          courseUnit: true,
          startTime: true,
          endTime: true,
          duration: true,
          status: true,
          isPublished: true,
        },
      });
      console.log('Active exams found:', activeExams);
      return { activeExams };
    } catch (error: any) {
      console.error('Error fetching active exams:', error);
      return { 
        error: 'Failed to fetch active exams',
        details: error?.message || 'Unknown error',
      };
    }
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    this.handleClientDisconnect(client);
  }

  @SubscribeMessage('join-exam-room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { examId: string; studentId?: string; role: 'student' | 'proctor' },
  ) {
    const roomId = `exam_${data.examId}`;
    client.join(roomId);

    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        students: new Map(),
        proctors: new Set(),
      });
    }

    const room = this.rooms.get(roomId);

    if (data.role === 'proctor') {
      room.proctors.add(client.id);
    } else if (data.role === 'student' && data.studentId) {
      room.students.set(client.id, {
        studentId: data.studentId,
        lastActive: new Date(),
      });
    }

    this.server.to(roomId).emit('room-update', {
      studentCount: room.students.size,
      proctorCount: room.proctors.size,
    });
  }

  @SubscribeMessage('stream-video')
  handleStreamVideo(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { 
      examId: string; 
      studentId: string; 
      stream: MediaStream | string; // Updated type
      streamType: 'webcam' | 'screen'; // Added stream type
    },
  ) {
    const roomId = `exam_${data.examId}`;
    const room = this.rooms.get(roomId);

    if (room && room.students.has(client.id)) {
      room.students.get(client.id).lastActive = new Date();
      
      this.server.to(roomId).emit('proctor-stream', {
        studentId: data.studentId,
        stream: data.stream,
        streamType: data.streamType,
        timestamp: new Date().toISOString(),
      });
    }
  }

  @SubscribeMessage('heartbeat')
  handleHeartbeat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { examId: string },
  ) {
    const roomId = `exam_${data.examId}`;
    const room = this.rooms.get(roomId);
    
    if (room?.students.has(client.id)) {
      room.students.get(client.id).lastActive = new Date();
    }
  }

  private handleClientDisconnect(client: Socket) {
    this.rooms.forEach((room, roomId) => {
      if (room.proctors.has(client.id)) {
        room.proctors.delete(client.id);
      }
      if (room.students.has(client.id)) {
        room.students.delete(client.id);
      }

      this.server.to(roomId).emit('room-update', {
        studentCount: room.students.size,
        proctorCount: room.proctors.size,
      });
    });
  }

  checkInactiveConnections() {
    const now = new Date();
    this.rooms.forEach((room, roomId) => {
      room.students.forEach((student, clientId) => {
        const inactiveTime = now.getTime() - student.lastActive.getTime();
        if (inactiveTime > 60000) { // 1 minute of inactivity
          console.log(`Student ${student.studentId} inactive for too long, disconnecting`);
          room.students.delete(clientId);
          this.server.to(roomId).emit('room-update', {
            studentCount: room.students.size,
            proctorCount: room.proctors.size,
          });
        }
      });
    });
  }

  async getOngoingAssessmentsCount(): Promise<number> {
    const now = new Date();
    return this.prisma.addAssessment.count({
      where: {
        isDraft: false,
        startTime: { lte: now },
        endTime: { gte: now },
      },
    });
  }
}

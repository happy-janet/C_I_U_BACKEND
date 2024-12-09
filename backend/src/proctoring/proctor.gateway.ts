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
  
  interface RoomData {
    students: Map<string, {
      studentId: string;
      lastActive: Date;
    }>;
    proctors: Set<string>;
  }
  
  @WebSocketGateway({
    namespace: 'proctor',
    cors: {
      origin: 'http://localhost:5173', // Your frontend URL
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })
  export class ProctorGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    private rooms: Map<string, RoomData> = new Map();
  
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
      @MessageBody() data: { examId: string; studentId?: string; role: 'student' | 'proctor' }
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
      @MessageBody() data: { examId: string; studentId: string; stream: string }
    ) {
      const roomId = `exam_${data.examId}`;
      const room = this.rooms.get(roomId);
  
      if (room && room.students.has(client.id)) {
        // Update student's last active timestamp
        room.students.get(client.id).lastActive = new Date();
  
        // Broadcast stream to all proctors in the room
        this.server.to(roomId).emit('proctor-stream', {
          studentId: data.studentId,
          stream: data.stream,
          timestamp: new Date().toISOString(),
        });
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
  }
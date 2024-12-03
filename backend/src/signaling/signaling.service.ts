import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

@Injectable()
export class ExamMonitoringService {
  private twilioClient: twilio.Twilio;

  constructor(private configService: ConfigService) {
    this.twilioClient = twilio(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN')
    );
  }

  // Create a video room for exam monitoring
  async createExamRoom(examId: string) {
    try {
      const room = await this.twilioClient.video.rooms.create({
        uniqueName: `exam-${examId}`,
        type: 'group'
      });
      return {
        roomSid: room.sid,
        roomName: room.uniqueName
      };
    } catch (error) {
      throw new Error(`Failed to create exam room: ${error.message}`);
    }
  }

  // Generate access token for participants
  generateAccessToken(identity: string, roomName: string) {
    const AccessToken = twilio.jwt.AccessToken;
    const VideoGrant = AccessToken.VideoGrant;

    const videoGrant = new VideoGrant({
      room: roomName
    });

    const token = new AccessToken(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_API_KEY'),
      this.configService.get('TWILIO_API_SECRET'),
      { identity }
    );

    token.addGrant(videoGrant);
    return token.toJwt();
  }

  // List participants in a room
  async listRoomParticipants(roomSid: string) {
    try {
      const participants = await this.twilioClient.video.rooms(roomSid)
        .participants.list();
      return participants.map(participant => ({
        identity: participant.identity,
        status: participant.status
      }));
    } catch (error) {
      throw new Error(`Failed to list room participants: ${error.message}`);
    }
  }

  // Monitor room events (alternative implementation)
  async monitorRoomEvents(roomSid: string) {
    try {
      // Fetch room information instead of recording rules
      const room = await this.twilioClient.video.rooms(roomSid).fetch();
      return {
        sid: room.sid,
        uniqueName: room.uniqueName,
        status: room.status,
        maxParticipants: room.maxParticipants,
        createdAt: room.dateCreated
      };
    } catch (error) {
      throw new Error(`Failed to monitor room events: ${error.message}`);
    }
  }

  // Additional method to get detailed room recordings (if available)
  async getRoomRecordings(roomSid: string) {
    try {
      const recordings = await this.twilioClient.video.rooms(roomSid)
        .recordings.list();
      return recordings.map(recording => ({
        sid: recording.sid,
        status: recording.status,
        duration: recording.duration,
        dateCreated: recording.dateCreated
      }));
    } catch (error) {
      throw new Error(`Failed to retrieve room recordings: ${error.message}`);
    }
  }
}
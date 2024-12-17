import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class WebSocketAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: 'https://ciu-online-exam-monitoring-system.netlify.app',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      maxHttpBufferSize: 1e8, // 100 MB max message size
      pingTimeout: 60000,
    });
    return server;
  }
}

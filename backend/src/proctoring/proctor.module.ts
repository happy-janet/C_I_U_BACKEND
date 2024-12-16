import { Module } from '@nestjs/common';
import { ProctorGateway } from './proctor.gateway';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [
    ProctorGateway,
    PrismaService,
    {
      provide: 'SOCKET_MONITOR',
      useFactory: (proctorGateway: ProctorGateway) => ({
        onModuleInit: () => {
          setInterval(() => {
            proctorGateway.checkInactiveConnections();
          }, 30000);
        }
      }),
      inject: [ProctorGateway]
    }
  ],
  exports: [ProctorGateway],
})
export class ProctorModule {}
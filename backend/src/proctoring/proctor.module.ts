import { Module } from '@nestjs/common';
import { ProctorGateway } from './proctor.gateway';
import { ProctorController } from './proctor.controller';
import { ProctorService } from './proctor.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaModule } from '../../prisma/prisma.module'; 

@Module({
  controllers: [ProctorController],
  providers: [
    ProctorGateway,
    ProctorService,
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
  imports: [PrismaModule],
  exports: [ProctorGateway, ProctorService]
})
export class ProctorModule {}
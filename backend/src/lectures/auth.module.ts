import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DashboardController } from './dashboard.controller'; // Adjust the import as necessary
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot(), // Ensure env variables are loaded properly
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Fetch secret from env
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController,DashboardController],
})
export class AuthModule {}

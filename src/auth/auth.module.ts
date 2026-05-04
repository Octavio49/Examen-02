import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/member/entities/member.entity';

@Module({
  imports:[
    JwtModule.register({
      global: true,
      secret: "You're just an user",
      signOptions: { expiresIn: '30min' },
    }),
    TypeOrmModule.forFeature([Member]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

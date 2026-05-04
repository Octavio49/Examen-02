import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMemberDto } from 'src/member/dto/create-member.dto';
import { Member } from 'src/member/entities/member.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginMemberDto } from 'src/member/dto/login-member.dto';
import { match } from 'assert';
import { Role } from 'src/enum/role';

@Injectable()
export class AuthService {

  constructor(@InjectRepository(Member) private memberRepo: Repository<Member>, private jwtService: JwtService){
  }

  async create(createMemberDto: CreateMemberDto) : Promise<Member> {
    const salt =10
    const {username, password} = createMemberDto

    const usernameExist = await this.memberRepo.findOneBy({username})
    if(usernameExist){
      const error={
            'statusCode':409,
            'error': 'conflict',
            'message': ["This username already exist"]
        }
        throw new ConflictException("error")
    }

    const hashPassword = await bcrypt.hash(password, salt)
    const member = this.memberRepo.create({
    ...createMemberDto,
    password: hashPassword,
    role: Role.USER
    });
    return this.memberRepo.save(member)
  }

  async login(loginMemberDto:LoginMemberDto) : Promise<{token:string}>{
    const {username, password} = loginMemberDto
    const usernameExist = await this.memberRepo.findOneBy({username})
    if(!usernameExist){
      const error={
            'statusCode': 404,
            'error': 'conflict',
            'message': ["username doesn't exists"]
        }
        throw new NotFoundException(error)
    }

    const matchPassword = await bcrypt.compare(password, usernameExist.password)
    if(!matchPassword){
      const error = {
        'statusCode': 401,
        'error': 'conflict',
        'message': ["Incorrect password"]
      }
      throw new UnauthorizedException(error)
    }

    const payload = {
      id : usernameExist.membership_id,
      username : usernameExist.username,
      role : usernameExist.role
    }
    console.log('payload:', payload)
    const token = await this.jwtService.signAsync(payload)
    return {token};
  }

}

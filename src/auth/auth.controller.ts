import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CreateMemberDto } from 'src/member/dto/create-member.dto';
import { MemberResponseDto } from 'src/member/dto/member-response.dto';
import { LoginMemberDto } from 'src/member/dto/login-member.dto';
import { Member } from 'src/member/entities/member.entity';
import { Role } from 'src/enum/role';
import { Roles } from './roles.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Roles(Role.DEVELOPER)
  @ApiBody({type:CreateMemberDto})
  @ApiCreatedResponse({type:MemberResponseDto, description:"created successfully"})
  @ApiBadRequestResponse({description:"Missing fields or password/username lenght less than 8"})
  @ApiConflictResponse({description:"Duplicate username"})
  @ApiForbiddenResponse({description:"Only developers can register new members"})
  @Post('/register')
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.authService.create(createMemberDto);
  }

  @ApiBody({type:LoginMemberDto})
  @ApiOkResponse({description:"Login successful", 
    schema:{example: { access_token: "Hsyia^8$" }}
  })
  @ApiNotFoundResponse({description:"This user doesn't exist"})
  @ApiUnauthorizedResponse({description:"Incorrect password"})
  @ApiBadRequestResponse({description:"Missing fields or incorrect data"})
  @Post('/login')
  login(@Body() loginMemberDto:LoginMemberDto) {
    return this.authService.login(loginMemberDto);
  }
}

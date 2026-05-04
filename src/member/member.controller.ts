import { Controller, Get, Body, Patch, Param, Delete, UseGuards, ForbiddenException, Request, NotFoundException } from '@nestjs/common';
import { MemberService } from './member.service';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/enum/role';
import { Roles } from 'src/auth/roles.decorator';
import { Member } from './entities/member.entity';
import { MemberResponseDto } from './dto/member-response.dto';

@ApiTags('Member')
@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) { }

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DEVELOPER)
  @ApiOkResponse({ type: Member, isArray: true, description: 'correct verification' })
  @ApiUnauthorizedResponse({ description: "Expired or invalid token" })
  @ApiForbiddenResponse({ description: "Users can't view all members" })
  @Get()
  findAll() {
    return this.memberService.findAll();
  }

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DEVELOPER, Role.USER)
  @ApiOkResponse({ type: Member, description: 'correct verification' })
  @ApiUnauthorizedResponse({ description: "Expired or invalid token" })
  @ApiForbiddenResponse({ description: "You can only view your own profile" })
  @ApiNotFoundResponse({ description: "This user doesn't exist" })
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const member = req.member;

    if (member.role === Role.USER && member.id !== +id) {
      throw new ForbiddenException('You can only view your own profile');
    }

    const found = await this.memberService.findOne(+id);
    if (!found) throw new NotFoundException('Member not found');
    return found;
  }

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.DEVELOPER)
  @ApiBody({ type: UpdateMemberDto })
  @ApiOkResponse({ type: Member, description: 'Correct verification, updated succesfully' })
  @ApiUnauthorizedResponse({ description: "Expired or invalid token" })
  @ApiForbiddenResponse({ description: "Only developers can update" })
  @ApiNotFoundResponse({ description: "This user doesn't exist" })
  @ApiBadRequestResponse({ description: "Incorrect fields" })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.memberService.update(+id, updateMemberDto);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOkResponse({ description: 'Correct verification, updated succesfully' })
  @ApiUnauthorizedResponse({ description: "Expired or invalid token" })
  @ApiForbiddenResponse({ description: "Only admins can promote another user to admin." })
  @ApiNotFoundResponse({ description: "This user doesn't exist" })
  @Patch(':id/make-admin')
  makeAdmin(@Param('id') id: string) {
    return this.memberService.makeAdmin(+id);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOkResponse({ description: 'Correct verification, updated succesfully' })
  @ApiUnauthorizedResponse({ description: "Expired or invalid token" })
  @ApiForbiddenResponse({ description: "Only admins can promote another user to developer." })
  @ApiNotFoundResponse({ description: "This user doesn't exist" })
  @Patch(':id/make-developer')
  makeDeveloper(@Param('id') id: string) {
    return this.memberService.makeDeveloper(+id);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOkResponse({ description: 'Correct verification, deleted succesfully' })
  @ApiUnauthorizedResponse({ description: "Expired or invalid token" })
  @ApiForbiddenResponse({ description: "Only andmis can delete" })
  @ApiNotFoundResponse({ description: "This user doesn't exist" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.memberService.remove(+id);
  }
}

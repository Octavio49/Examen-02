import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateRoleDto } from './dto/update-role.dot';
import { Role } from 'src/enum/role';

@Injectable()
export class MemberService {
  constructor(@InjectRepository(Member) private repoMember:Repository<Member>){
  }

  async findAll() : Promise<Member[]>{
    return this.repoMember.find();
  }

  async findOne(id: number) : Promise<Member | null> {
    return this.repoMember.findOneBy({membership_id: id });
  }

  async update(id: number, updateMemberDto: UpdateMemberDto) : Promise<Member | null>{
    const member = await this.repoMember.findOneBy({ membership_id: id });
    if (!member) throw new NotFoundException('Member not found');
    await this.repoMember.update(id, updateMemberDto);
    return this.findOne(id);
  }

  async makeAdmin(id: number): Promise<void> {
    const member = await this.repoMember.findOneBy({ membership_id: id });
    if (!member) throw new NotFoundException('Member not found');
    await this.repoMember.update(id, { role: Role.ADMIN });
  }

  async makeDeveloper(id:number) : Promise<void>{ 
    const member = await this.repoMember.findOneBy({ membership_id: id });
    if (!member) throw new NotFoundException('Member not found');
    await this.repoMember.update(id, { role: Role.DEVELOPER });
  }

  async remove(id: number) : Promise<void> {
    const member = await this.repoMember.findOneBy({ membership_id: id });
    if (!member) throw new NotFoundException('Member not found');
    await this.repoMember.delete(id);
  }

}

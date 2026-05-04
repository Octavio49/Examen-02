import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberDto } from './create-member.dto';
import { IsDate, IsDateString, IsEmail, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {

    @ApiProperty({required:false, example:'2000-03-24', description:"Member's date of birth, format:YYYY-MM-DD"})
    @IsOptional()
    @IsDateString()
    DOB?:Date

    @ApiProperty({required:false, example:'Las Villas #12', description:"Member's address"})
    @IsOptional()
    @IsString()
    address?:string

    @ApiProperty({required:false, example:'Octavio@gmail.com', description:"Member's email"})
    @IsOptional()
    @IsString()
    @IsEmail()
    email?:string

    @ApiProperty({required:false, example:'4928745144', description:"Member's number"})
    @IsOptional()
    @IsString()
    @Length(10,10)
    contact_no?:string
}

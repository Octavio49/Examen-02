import { ApiProperty } from "@nestjs/swagger"
import { IsString, MinLength } from "class-validator"

export class LoginMemberDto{
    
    @ApiProperty({example:'OctavioD12i', description:"Member's username"})
    @IsString()
    @MinLength(8)
    username!:string

    @ApiProperty({example:'Ise6YnJ9', description:"Member's password"})
    @IsString()
    @MinLength(8)
    password!:string

}
import { ApiProperty } from "@nestjs/swagger"
import { Role } from "src/enum/role"

export class MemberResponseDto {
    @ApiProperty({ example: 3, description: "Member's ID" })
    membership_id!: number

    @ApiProperty({ example: 'USER', enum: Role, description: "Member's role" })
    role!: Role

    @ApiProperty({ example: 'Octavio De Avila', description: "Member's full name" })
    fullName!: string

    @ApiProperty({ example: 'OctavioD12i', description: "Member's username" })
    username!: string

    @ApiProperty({ example: 'NULL', description: "Member's date of birth, format:YYYY-MM-DD" })
    DOB!: Date

    @ApiProperty({ example: 'NULL', description: "Member's address" })
    address!: string

    @ApiProperty({ example: 'NULL', description: "Member's email" })
    email!: string

    @ApiProperty({ example: 'NULL', description: "Member's number" })
    contact_no!: string
}
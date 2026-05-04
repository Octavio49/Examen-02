import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Role } from "src/enum/role";

export class UpdateRoleDto {
    @ApiProperty({ example: 'ADMIN', enum:Role})
    @IsEnum(Role)
    role!: Role
}
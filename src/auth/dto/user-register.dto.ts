import { Role } from "src/roles/entities/role.entity";

export class UserRegisterDto {
    firstname?: string;
    lastname?: string;
    email: string;
    password: string;
    role?: Role;
}

export class CreateUserDto {
    firstname?: string;
    lastname?: string;
    email: string;
    password: string;
    roleId?: number;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
}

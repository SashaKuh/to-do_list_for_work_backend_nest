import { IsEmail, IsNotEmpty } from 'class-validator';

export class AssignTodoDto {
        @IsEmail()
        @IsNotEmpty()
        email: string;
}
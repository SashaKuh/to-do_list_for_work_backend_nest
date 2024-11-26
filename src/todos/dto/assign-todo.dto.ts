import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignTodoDto {
        @ApiProperty({
                description: 'Email of the user to assign the task',
                example: 'user@example.com'
        })
        @IsEmail()
        @IsNotEmpty()
        email: string;
}
import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from '../services/todo.service';
import { TodoRepository } from '../repositories/todo.repository';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { AssignTodoDto } from '../dto/assign-todo.dto';
import { Todo, TodoDifficulty, TodoStatus } from '../schemas/todo.schema';
import { UserRole } from 'src/auth/schemas/auth.schema';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('TodoService', () => {
        let todoService: TodoService;
        let todoRepository: TodoRepository;

        const mockOwner = {
                id: 'user123',
                name: 'Test User',
                email: 'test@example.com'
        };

        const mockTodo: Todo = {
                title: 'Test Task',
                description: 'Test Description',
                difficulty: TodoDifficulty.MEDIUM,
                status: TodoStatus.IN_PROGRESS,
                owners: [{
                        _id: mockOwner.id as any,
                        name: mockOwner.name,
                        email: mockOwner.email
                }],
                createdAt: new Date(),
        };

        beforeEach(async () => {
                const module: TestingModule = await Test.createTestingModule({
                        providers: [
                                TodoService,
                                {
                                        provide: TodoRepository,
                                        useValue: {
                                                findAll: jest.fn(),
                                                findById: jest.fn(),
                                                create: jest.fn(),
                                                update: jest.fn(),
                                                assignTask: jest.fn(),
                                                delete: jest.fn(),
                                        },
                                },
                        ],
                }).compile();

                todoService = module.get<TodoService>(TodoService);
                todoRepository = module.get<TodoRepository>(TodoRepository);
        });

        describe('getAllTasks', () => {
                it('should return an array of tasks for a user', async () => {
                        const expectedResult = [mockTodo];
                        jest.spyOn(todoRepository, 'findAll').mockResolvedValue(expectedResult);

                        const result = await todoService.getAllTasks(mockOwner.id, UserRole.USER);
      
                        expect(result).toEqual(expectedResult);
                        expect(todoRepository.findAll).toHaveBeenCalledWith(mockOwner.id, UserRole.USER);
                });
        });

        describe('getTaskById', () => {
                it('should return a single task', async () => {
                        const taskId = 'task123';
                        jest.spyOn(todoRepository, 'findById').mockResolvedValue(mockTodo);

                        const result = await todoService.getTaskById(taskId, mockOwner.id, UserRole.USER);
      
                        expect(result).toEqual(mockTodo);
                        expect(todoRepository.findById).toHaveBeenCalledWith(taskId, mockOwner.id, UserRole.USER);
                });

                it('should throw NotFoundException if task is not found', async () => {
                        const taskId = 'nonexistent-task';
                        jest.spyOn(todoRepository, 'findById').mockResolvedValue(null);

                        await expect(todoService.getTaskById(taskId, mockOwner.id, UserRole.USER))
                                .rejects.toThrow(NotFoundException);
                });
        });

        describe('createTask', () => {
                it('should create a new task', async () => {
                        const createTodoDto: CreateTodoDto = {
                                title: 'New Task',
                                difficulty: TodoDifficulty.EASY,
                                status: TodoStatus.IN_PROGRESS
                        };

                        jest.spyOn(todoRepository, 'create').mockResolvedValue(mockTodo);

                        const result = await todoService.createTask(mockOwner, createTodoDto);
      
                        expect(result).toEqual(mockTodo);
                        expect(todoRepository.create).toHaveBeenCalledWith(
                                { _id: mockOwner.id, name: mockOwner.name, email: mockOwner.email },
                                createTodoDto
                        );
                });

                it('should throw BadRequestException for invalid task data', async () => {
                        const invalidDto = {
                                description: 'Incomplete task'
                        } as CreateTodoDto;

                        await expect(todoService.createTask(mockOwner, invalidDto))
                                .rejects.toThrow(BadRequestException);
                });
        });

        describe('updateTask', () => {
                it('should update an existing task', async () => {
                        const taskId = 'task123';
                        const updateTodoDto: UpdateTodoDto = {
                                title: 'Updated Task',
                                status: TodoStatus.DONE
                        };

                        jest.spyOn(todoRepository, 'update').mockResolvedValue(mockTodo);

                        const result = await todoService.updateTask(taskId, mockOwner.id, updateTodoDto, UserRole.USER);
      
                        expect(result).toEqual(mockTodo);
                        expect(todoRepository.update).toHaveBeenCalledWith(taskId, mockOwner.id, updateTodoDto, UserRole.USER);
                });

                it('should throw NotFoundException if task update fails', async () => {
                        const taskId = 'nonexistent-task';
                        const updateTodoDto: UpdateTodoDto = {
                                title: 'Updated Task'
                        };

                        jest.spyOn(todoRepository, 'update').mockResolvedValue(null);

                        await expect(todoService.updateTask(taskId, mockOwner.id, updateTodoDto, UserRole.USER))
                                .rejects.toThrow(NotFoundException);
                });
        });

        describe('assignTask', () => {
                it('should assign a task to another user', async () => {
                        const taskId = 'task123';
                        const assignTodoDto: AssignTodoDto = {
                                email: 'newuser@example.com'
                        };

                        jest.spyOn(todoRepository, 'assignTask').mockResolvedValue(mockTodo);

                        const result = await todoService.assignTask(taskId, mockOwner.id, assignTodoDto, UserRole.USER);
      
                        expect(result).toEqual(mockTodo);
                        expect(todoRepository.assignTask).toHaveBeenCalledWith(taskId, mockOwner.id, assignTodoDto, UserRole.USER);
                });

                it('should throw BadRequestException if task assignment fails', async () => {
                        const taskId = 'task123';
                        const assignTodoDto: AssignTodoDto = {
                                email: 'nonexistent@example.com'
                        };

                        jest.spyOn(todoRepository, 'assignTask').mockResolvedValue(null);

                        await expect(todoService.assignTask(taskId, mockOwner.id, assignTodoDto, UserRole.USER))
                                .rejects.toThrow(BadRequestException);
                });
        });

        describe('deleteTask', () => {
                it('should delete a task', async () => {
                        const taskId = 'task123';
                        jest.spyOn(todoRepository, 'delete').mockResolvedValue(mockTodo);

                        await todoService.deleteTask(taskId, mockOwner.id, UserRole.USER);
      
                        expect(todoRepository.delete).toHaveBeenCalledWith(taskId, mockOwner.id, UserRole.USER);
                });

                it('should throw NotFoundException if task deletion fails', async () => {
                        const taskId = 'nonexistent-task';
                        jest.spyOn(todoRepository, 'delete').mockResolvedValue(null);

                        await expect(todoService.deleteTask(taskId, mockOwner.id, UserRole.USER))
                                .rejects.toThrow(NotFoundException);
                });
        });
});
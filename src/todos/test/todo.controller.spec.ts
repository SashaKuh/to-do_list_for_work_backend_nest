import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from '../controllers/todo.controller';
import { TodoService } from '../services/todo.service';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { AssignTodoDto } from '../dto/assign-todo.dto';
import { Todo, TodoDifficulty, TodoStatus } from '../schemas/todo.schema';
import { UserRole } from 'src/auth/schemas/auth.schema';
import { RequestWithUser } from '../interfaces/request-with-user.interface';

describe('TodoController', () => {
        let todoController: TodoController;
        let todoService: TodoService;

        const mockUser = {
                id: 'user123',
                name: 'Test User',
                email: 'test@example.com',
                role: UserRole.USER
        };

        const mockRequestWithUser = {
                user: mockUser
        } as RequestWithUser;

        const mockTodo: Todo = {
                title: 'Test Task',
                description: 'Test Description',
                difficulty: TodoDifficulty.MEDIUM,
                status: TodoStatus.IN_PROGRESS,
                owners: [{
                        _id: mockUser.id as any,
                        name: mockUser.name,
                        email: mockUser.email
                }],
                createdAt: new Date(),
        };

        beforeEach(async () => {
                const module: TestingModule = await Test.createTestingModule({
                        controllers: [TodoController],
                        providers: [
                                {
                                        provide: TodoService,
                                        useValue: {
                                                getAllTasks: jest.fn(),
                                                getTaskById: jest.fn(),
                                                createTask: jest.fn(),
                                                updateTask: jest.fn(),
                                                assignTask: jest.fn(),
                                                deleteTask: jest.fn(),
                                        },
                                },
                        ],
                }).compile();

                todoController = module.get<TodoController>(TodoController);
                todoService = module.get<TodoService>(TodoService);
        });

        describe('getAllTasks', () => {
                it('should return an array of tasks', async () => {
                        const expectedResult = [mockTodo];
                        jest.spyOn(todoService, 'getAllTasks').mockResolvedValue(expectedResult);

                        const result = await todoController.getAllTasks(mockRequestWithUser);
      
                        expect(result).toEqual(expectedResult);
                        expect(todoService.getAllTasks).toHaveBeenCalledWith(mockUser.id, mockUser.role);
                });
        });

        describe('getTaskById', () => {
                it('should return a single task', async () => {
                        const taskId = 'task123';
                        jest.spyOn(todoService, 'getTaskById').mockResolvedValue(mockTodo);

                        const result = await todoController.getTaskById(taskId, mockRequestWithUser);
      
                        expect(result).toEqual(mockTodo);
                        expect(todoService.getTaskById).toHaveBeenCalledWith(taskId, mockUser.id, mockUser.role);
                });
        });

        describe('createTask', () => {
                it('should create a new task', async () => {
                        const createTodoDto: CreateTodoDto = {
                                title: 'New Task',
                                difficulty: TodoDifficulty.EASY,
                                status: TodoStatus.IN_PROGRESS
                        };

                        jest.spyOn(todoService, 'createTask').mockResolvedValue(mockTodo);

                        const result = await todoController.createTask(createTodoDto, mockRequestWithUser);
      
                        expect(result).toEqual(mockTodo);
                        expect(todoService.createTask).toHaveBeenCalledWith(
                                {
                                        id: mockUser.id,
                                        name: mockUser.name,
                                        email: mockUser.email
                                },
                                createTodoDto
                        );
                });
        });

        describe('updateTask', () => {
                it('should update an existing task', async () => {
                        const taskId = 'task123';
                        const updateTodoDto: UpdateTodoDto = {
                                title: 'Updated Task',
                                status: TodoStatus.DONE
                        };

                        jest.spyOn(todoService, 'updateTask').mockResolvedValue(mockTodo);

                        const result = await todoController.updateTask(taskId, updateTodoDto, mockRequestWithUser);
      
                        expect(result).toEqual(mockTodo);
                        expect(todoService.updateTask).toHaveBeenCalledWith(taskId, mockUser.id, updateTodoDto, mockUser.role);
                });
        });

        describe('assignTask', () => {
                it('should assign a task to another user', async () => {
                        const taskId = 'task123';
                        const assignTodoDto: AssignTodoDto = {
                                email: 'newuser@example.com'
                        };

                        jest.spyOn(todoService, 'assignTask').mockResolvedValue(mockTodo);

                        const result = await todoController.assignTask(taskId, assignTodoDto, mockRequestWithUser);
      
                        expect(result).toEqual(mockTodo);
                        expect(todoService.assignTask).toHaveBeenCalledWith(taskId, mockUser.id, assignTodoDto, mockUser.role);
                });
        });

        describe('deleteTask', () => {
                it('should delete a task', async () => {
                        const taskId = 'task123';
                        jest.spyOn(todoService, 'deleteTask').mockResolvedValue(undefined);

                        await todoController.deleteTask(taskId, mockRequestWithUser);
      
                        expect(todoService.deleteTask).toHaveBeenCalledWith(taskId, mockUser.id, mockUser.role);
                });
        });

        describe('Error Handling', () => {
                it('should handle task not found scenario', async () => {
                        const taskId = 'nonexistent-task';
                        jest.spyOn(todoService, 'getTaskById').mockRejectedValue(new Error('Task not found'));

                        await expect(todoController.getTaskById(taskId, mockRequestWithUser))
                                .rejects.toThrow('Task not found');
                });

                it('should handle unauthorized task access', async () => {
                        const taskId = 'task123';
                        jest.spyOn(todoService, 'updateTask').mockRejectedValue(new Error('Not authorized'));

                        await expect(todoController.updateTask(taskId, {}, mockRequestWithUser))
                                .rejects.toThrow('Not authorized');
                });
        });
});
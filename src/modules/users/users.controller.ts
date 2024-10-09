import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ListUsersDto } from './dtos/list-users.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Response } from '../../commons/others/response';
import PaginationResponse from 'src/commons/others/pagination-response';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/auth/local.guard';
import { User } from 'src/entities/users.entity';
import { TokenDto } from './dtos/token.dto';
import { Public } from 'src/auth/public.route';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Serialize(UserDto)
  @Post('/auth/signup')
  async signUp(@Body() body: CreateUserDto) {
    const newUser = await this.authService.signUp(body);
    return new Response(newUser);
  }

  @Public()
  @Serialize(TokenDto)
  @UseGuards(LocalAuthGuard)
  @Post('/auth/login')
  async signIn(@Request() req: { user: User }) {
    return new Response(this.authService.login(req.user));
  }

  @Serialize(UserDto)
  @Get('/profile')
  async getProfile(@Request() req: { user: User }) {
    const userProfile = await this.usersService.findOneById(req.user.id);
    return new Response(userProfile);
  }

  @Serialize(UserDto)
  @Get('/users')
  async listUsers(@Query() query: ListUsersDto) {
    const { search: _, ...pagination } = query;
    const [users, total] = await this.usersService.findAndCount(pagination);
    return new PaginationResponse(users, {
      page: pagination.page,
      limit: pagination.limit,
      total: total,
    });
  }

  @Serialize(UserDto)
  @Get('/user/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return new Response(user);
  }

  @Serialize(UserDto)
  @Patch('/user/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const updatedUser = await this.usersService.update(id, body);
    return new Response(updatedUser);
  }

  @Delete('/user/:id')
  async deleteUser(@Param('id') id: string) {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    await this.usersService.delete(id);
    return new Response(null);
  }
}

import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AccessLevel } from 'src/access-level/enum/access-level.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() body: any) {
    const { userId, ...createUserDto } = body;
    return this.usersService.create(createUserDto, Number(userId));
  }
  @Post('/noLog')
  async createUserSemLog(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createNoLog(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':usuario')
  async getUserByName(@Param('usuario') usuario: string) {
    return this.usersService.findByUsername(usuario);
  }

  //@UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    return this.usersService.findUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Body('userId', ParseIntPipe) userId: number
  ) {
    return this.usersService.deleteUser(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/password/:id')
  async updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body('password') password: string,
    @Body('userId', ParseIntPipe) userId: number
  ) {
    return this.usersService.putPassword(id, password, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/access-level/:id')
  async updateAccessLevel(
    @Param('id', ParseIntPipe) id: number,
    @Body('accessLevel') accessLevel: AccessLevel,
    @Body('userId', ParseIntPipe) userId: number
  ) {
    return this.usersService.putAccessLevel(id, accessLevel, userId);
  }
  @UseGuards(JwtAuthGuard)
  @Post('/vincular-usuario/:usuarioId')
  async vincularUsuario(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Body('adminId', ParseIntPipe) adminId: number,
    @Body('usuarioTopManager', ParseIntPipe) usuarioTopManager: number
  ) {
    return await this.usersService.vincularUsuario(
      usuarioId,
      usuarioTopManager,
      adminId
    );
  }
}

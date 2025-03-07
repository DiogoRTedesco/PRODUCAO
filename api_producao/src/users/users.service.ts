import { Injectable } from '@nestjs/common';
import { PrismaSqliteService } from 'src/prisma/prisma-sqlite.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { AccessLevel } from 'src/access-level/enum/access-level.enum';
import { LogsService } from 'src/logsSystem/logs.service';
import { LogsEnum } from 'src/logsSystem/enum/logs.enum';
import { AccessLevelService } from 'src/access-level/access-level.service';

@Injectable()
export class UsersService {

    constructor(
        private readonly prisma: PrismaSqliteService,
        private readonly accessLevelService: AccessLevelService,
        private readonly logsService: LogsService 

      ) {}
    

      async create(createUserDto: CreateUserDto, userId: number) {
        try {
          const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
          //const { userId: _, ...userData } = createUserDto;
      
          const newUser = await this.prisma.user.create({
            data: {
              ...createUserDto,
              password: hashedPassword, 
            },
          });
      
          await this.logsService.createLogs(LogsEnum.USER_CREATED, userId, { newUserId: newUser.id });
      
          return newUser;
        } catch (error) {
          await this.logsService.createLogs(LogsEnum.USER_CREATION_FAILED, userId, {
            errorMessage: error.message,
            attemptedData: { ...createUserDto, password: '***' }, // Oculta a senha no log
          });
      
          throw new Error(`Erro ao criar usuário: ${error.message}`);
        }
      }
      
      async createNoLog(createUserDto: CreateUserDto) {
        try {
          const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
          const newUser = await this.prisma.user.create({
            data: {
              ...createUserDto,
              password: hashedPassword,
            },
          });
      

          return newUser;
        } catch (error) {
          
         
          throw new Error(`Erro ao criar usuário: ${error.message}`);
        }
      }
    
      async findByUsername(usuario: string) {
        return this.prisma.user.findUnique({
          where: { usuario },
        });
      }
    
      async findById(id: number) {
        return this.prisma.user.findUnique({
          where: { id },
        });
      }
    
      async deleteUser(id: number, userId: number) {
        try{
          const deleteUser = this.prisma.user.delete({
            where: { id },
          });
          await this.logsService.createLogs(LogsEnum.DELETE_USER, userId,{DeleteUser: id})
          return deleteUser
        }catch(error){
          await this.logsService.createLogs(LogsEnum.UPDATE_FAILED,userId,{
            errorMessage: error.message,
          })
          throw new Error(`Erro ao Deletar usuário: ${error.message}`);
        }
      }
      async putPassword(id: number, password: string, userId: number) {
        try{
          const hashedPassword = await bcrypt.hash(password, 10);
          const putPassword =  this.prisma.user.update({
            where: { id },
            data:{
              password:hashedPassword
            }
          });
          await this.logsService.createLogs(LogsEnum.UPDATE_PASSWORD,userId)

          return putPassword
        }catch(error){
          await this.logsService.createLogs(LogsEnum.UPDATE_FAILED,userId,{
            errorMessage: error.message,
          })
          throw new Error(`Erro ao Alterar senha do usuário: ${error.message}`);
        }
       
      }
      async putAccessLevel(id: number, accessLevel: AccessLevel, userId: number) {
        if (!this.accessLevelService.isValidAccessLevel(accessLevel)) {
          throw new Error(`O nível de acesso '${accessLevel}' não é válido.`);
        }
      
        try {

          const previousUser = await this.prisma.user.findUnique({
            where: { id },
            select: { accessLevel: true }, // Pegamos apenas o nível de acesso anterior
          });
      
          if (!previousUser) {
            throw new Error(`Usuário com ID ${id} não encontrado.`);
          }
      
          const updatedUser = await this.prisma.user.update({
            where: { id },
            data: { accessLevel },
          });
      
          await this.logsService.createLogs(LogsEnum.UPDATE_ACCESSLEVEL, userId, {
            previousAccessLevel: previousUser.accessLevel, 
            newAccessLevel: updatedUser.accessLevel, 
          });
      
          return updatedUser;
        } catch (error) {
          await this.logsService.createLogs(LogsEnum.UPDATE_FAILED, userId, {
            errorMessage: error.message,
          });
      
          throw new Error(`Erro ao atualizar Access Level do usuário: ${error.message}`);
        }
      }
      
      async findUsers() {
        return this.prisma.user.findMany();
      }

      async vincularUsuario(usuarioId: number, adminId:number, usuarioTopManager: number) {
        try {
          const updatedUser = await this.prisma.user.update({
            where: { id: usuarioId },
            data: { usuarioTopManager },
          });
    
          await this.logsService.createLogs(LogsEnum.LINK_USER, adminId, {
            message: `Usuário ${usuarioId} vinculado ao Top Manager ${usuarioTopManager}`,
          });
          return { message: 'Usuário vinculado com sucesso!', user: updatedUser };
        } catch (error) {
          await this.logsService.createLogs(LogsEnum.LINK_FAILED, adminId, {
            errorMessage: error.message,
          });
    
          throw new Error(`Erro ao vincular usuário: ${error.message}`);
        }
      }
}

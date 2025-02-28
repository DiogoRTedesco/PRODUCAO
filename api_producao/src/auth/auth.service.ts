import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaSqliteService } from 'src/prisma/prisma-sqlite.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaSqliteService, private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  private async generateAccessToken(user:any){
    const payload={user:user.usuario, id:user.id, role:user.accessLevel};
    return this.jwtService.sign(payload, {expiresIn: '1h'});
  }

  private async generateRefreshToken(user:any){
    const payload = {id: user.id};
    return this.jwtService.sign(payload, {expiresIn: '7D'})
  }
  
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.usuario, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    //await this.usersService.saveRefreshToken(user.id, refreshToken);

    return {
      id: user.id,
      username: user.usuario,
      role: user.accessLevel,
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken:string){
    try{
      const decoded = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findById(decoded.id)
      if(!user){
        throw new UnauthorizedException('Invalid refresh token')
      }
      const newAccessToken = await this.generateAccessToken(user)
        return{accessToken: newAccessToken}
      
      }catch(error){
        throw new UnauthorizedException('Invalid refresh token')
    }
  }

}

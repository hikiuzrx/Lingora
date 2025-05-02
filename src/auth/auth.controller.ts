import {
    Body,
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    UsePipes,
    ValidationPipe,
    Res,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { RegisterDto } from './dtos/register.dto';
  import { Response } from 'express';
  import { LoginDto } from './dtos/login.dto';
  import { RefreshTokenDto } from './dtos/refresh.dto';
import { truncate } from 'fs/promises';
  
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Post('register')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    
    async register(@Body() body: RegisterDto,
    @Res({ passthrough: true }) res: Response) {
      const { name, email, password } = body;
      const userData=await this.authService.register(name, email, password);
      res.cookie('accessToken', userData.accessToken, {
        httpOnly: false,
        secure: true, // set to false if not using HTTPS locally
        sameSite: 'strict',
        maxAge: 1000 * 60 * 15, // 15 minutes
      });
      res.cookie("refreshToken",userData.refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:1000 *60*60*24*7
      })
      return {message:"registration successfull",
        user:{
          id:userData.id,
          name:userData.name,
          email:userData.email
        }
      }
    }
  
    @HttpCode(HttpStatus.OK)
    @Post('login')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async login(@Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response) {
      const { email, password } = body;
     const userData=await  this.authService.login(email, password);
     if(userData.auth === false){
      return {message:"failed login ",success:false ,user:null}
     }else{
      res.cookie('accessToken', userData.userData?.user.accessToken, {
        httpOnly: false,
        secure: true, // set to false if not using HTTPS locally
        sameSite: 'strict',
        maxAge: 1000 * 60 * 15, // 15 minutes
      });
      res.cookie("refreshToken",userData.userData?.user.refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:1000 *60*60*24*7
      })
      return {message:"login successfull",
        user:{
          id:userData.userData?.user.id,
          name:userData.userData?.user.name,
          email:userData.userData?.user.email
        },
        success:true
     }
    }
  }
  
    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async refresh(@Body() body: RefreshTokenDto) {
      const { refreshToken } = body;
      return this.authService.refreshTokens(refreshToken);
    }
  }
  
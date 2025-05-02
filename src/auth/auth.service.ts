import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema'
import { JwtAuthService } from './jwt.service';
import * as bcrypt from "bcryptjs"


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwt: JwtAuthService,
  ) {}

  private async hashPassword(password: string, ) {
    const salt = await bcrypt.genSalt()
    return await bcrypt.hash(password,salt)
  }

  async register(name:string,email: string, password: string) {
  
    const existingUser = await this.userModel.findOne({
        $or: [{ name }, { email }],
      });
    
    if(existingUser){
        throw new ConflictException("user with this credentials already exists")
    }     
    const passwordHash =await this.hashPassword(password)

    const user = await this.userModel.create({
        name,
        email,
      passwordHash,
    });

    return {
      id:user._id,
      name:user.name,
      email:user.email,  
      accessToken: this.jwt.generateAccessToken({id:user._id as string,role:user.role}),
      refreshToken: this.jwt.generateRefreshToken({id:user._id as string,role:user.role})
    };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');
    const auth = await bcrypt.compare(password,user.passwordHash)
    if(!auth){
        return {userData:null ,auth:false}
    }else{
        return{userData:{
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                accessToken:this.jwt.generateAccessToken({id:user._id as string,role:user.role}),
                refreshToken: this.jwt.generateRefreshToken({id:user._id as string,role:user.role})
            }
        },auth:true}
    }
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwt.verifyToken(refreshToken, false);
      const user = await this.userModel.findOne({ email: payload.email });
      

   
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
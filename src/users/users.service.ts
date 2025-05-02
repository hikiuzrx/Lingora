import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  /**
   * Find user by email
   * @param email User's email address
   * @returns User document or null
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  /**
   * Create a new user
   * @param email User's email
   * @param passwordHash Hashed password string
   * @returns Created user document
   */
  async createUser(email: string, passwordHash: string): Promise<User> {
    const user = new this.userModel({ email, passwordHash });
    return user.save();
  }

  /**
   * Update user's refresh token
   * @param email User's email
   * @param refreshToken New refresh token
   * @returns Updated user document
   */
  async updateRefreshToken(email: string, refreshToken: string): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { email },
      { refreshToken },
      { new: true }
    ).exec();

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  /**
   * Remove refresh token (for logout functionality)
   * @param email User's email
   * @returns Updated user document
   */
  async removeRefreshToken(email: string): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { email },
      { $unset: { refreshToken: 1 } },
      { new: true }
    ).exec();

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  /**
   * Change user's password
   * @param email User's email
   * @param newPasswordHash New hashed password
   * @returns Updated user document
   */
  async changePassword(email: string, newPasswordHash: string): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { email },
      { passwordHash: newPasswordHash },
      { new: true }
    ).exec();

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  /**
   * Find user by ID
   * @param id User's MongoDB ID
   * @returns User document or null
   */
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }
}
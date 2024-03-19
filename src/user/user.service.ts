import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as crypto from 'crypto'
import { Pbkdf2Config } from '../config/pbkdf2.config';
import { UserRepository } from './user.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly prismaService: PrismaService) { }

  private hashPbkdf2(password: string): string {
    const { iterations, hashBytes, digest, saltBytes } = Pbkdf2Config;
    const salt = crypto.randomBytes(saltBytes).toString("hex");
    const hash = crypto
      .pbkdf2Sync(password, salt, iterations, hashBytes, digest)
      .toString("hex");
    const hashPassword = [salt, hash].join("$");
    return hashPassword

  }

  verifyPassword(password: string, combined: string) {
    const { iterations, hashBytes, digest } = Pbkdf2Config;
    const [salt, originalHash] = combined.split("$");
    const hash = crypto.pbkdf2Sync(password, salt, iterations, hashBytes, digest).toString("hex");
    const isPasswordMatch = hash === originalHash;
    return isPasswordMatch
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const userDto = {
        ...createUserDto,
        password: this.hashPbkdf2(createUserDto.password)
      }
      return await this.userRepository.create({
        data: userDto,
      })
    } catch (error) {
      throw error
    }
  }

  async createMany(createUserDto: CreateUserDto[]) {
    try {
      createUserDto.map(async (item) => {
        item.password = this.hashPbkdf2(item.password)
      })
      return await this.userRepository.createMany({
        data: createUserDto,
      })
    } catch (error) {
      throw error
    }
  }

  async findAll() {
    const user = await this.userRepository.findMany()
    return user
  }

  async findOne(email: string) {
    try {
      const user = await this.userRepository.findFirst({
        where: { email: email }
      })
      return user
    } catch (error) {
      throw error
    }
  }

  async removeAll() {
    try {
      await this.prismaService.users.deleteMany()
      return { message: 'delete all user success' }
    } catch (error) {
      throw error
    }
  }
}

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) { }

  private async hash(password: string): Promise<string> {
    const saltOrRounds = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, saltOrRounds);
    return hashPassword;
  }

  async create(createUserDto: CreateUserDto) {
    const userDto = {
      ...createUserDto,
      password: await this.hash(createUserDto.password)
    }
    return await this.prismaService.users.create({
      data: userDto,

    })
  }

  async createMany(createUserDto: CreateUserDto[]) {
    await Promise.all(createUserDto.map(async (item) => {
      item.password = await this.hash(item.password)
    }))
    return await this.prismaService.users.createMany({
      data: createUserDto,

    })
  }

  async findAll() {
    const user = await this.prismaService.users.findMany()
    return user
  }

  async findOne(email: string) {
    const user = await this.prismaService.users.findFirst({
      where: { email: email }
    })
    return user
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

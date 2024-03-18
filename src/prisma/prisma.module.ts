import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaController } from './prisma.controller';
import { PostRepository } from '../post/post.repository';

@Module({
  controllers: [PrismaController],
  providers: [PrismaService, PostRepository],
  exports: [PrismaService, PostRepository]
})
export class PrismaModule { }

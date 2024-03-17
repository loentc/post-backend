import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { getSkip, getTotalPage } from '../utils/pagination';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) { }
  async create(createPostDto: CreatePostDto) {
    try {
      await this.prismaService.posts.create({
        data: createPostDto
      })
      return { message: 'create post success' }
    } catch (error) {
      throw error
    }
  }

  async findAll(page: number, pageSize: number) {
    try {
      const skip = getSkip(page, pageSize || 10)
      const [totalDoc, posts] = await Promise.all([
        await this.prismaService.posts.count(),
        await this.prismaService.posts.findMany({
          skip: skip,
          take: pageSize || 10,
        })
      ])

      const totalPage = getTotalPage(totalDoc, pageSize)

      const mapData = posts.map((item) => {
        const { title, postedAt, postedBy, tags, content, id } = item
        return {
          key: id,
          title,
          postedAt,
          postedBy,
          tags,
          content
        }
      })

      const result = { data: mapData, totalPage, totalDoc }
      return result
    } catch (error) {
      throw error
    }
  }

  async createMany(createPostDto: CreatePostDto[]) {
    try {
      await this.prismaService.posts.createMany({
        data: createPostDto
      })
      return { message: 'create posts success' }
    } catch (error) {
      throw error
    }
  }

  async removeAll() {
    try {
      await this.prismaService.posts.deleteMany()
      return { message: 'delete all posts success' }
    } catch (error) {
      throw error
    }
  }
}

import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { getSkip, getTotalPage } from '../utils/pagination';
import { PostRepository } from './post.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository, private readonly prismaService: PrismaService) { }
  async create(createPostDto: CreatePostDto) {
    try {
      await this.postRepository.create({
        data: createPostDto
      })
      return { message: 'create post success' }
    } catch (error) {
      throw error
    }
  }

  async findAll(page: number, pageSize: number, search: string) {
    try {
      const skip = getSkip(page, pageSize || 10)
      const [totalDoc, posts] = await Promise.all([
        await this.postRepository.count(),
        await this.prismaService.posts.findMany({
          skip: skip,
          take: pageSize || 10,
          where: {
            title: {
              contains: search
            },
          }
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
      await this.postRepository.createMany({
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

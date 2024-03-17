import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('pageSize') pageSize: number) {
    return this.postService.findAll(page, pageSize);
  }

}

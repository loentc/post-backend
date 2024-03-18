import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PostRepository {
    constructor(private readonly prismaService: PrismaService) { }

    get create() {
        return this.prismaService.posts.create
    }

    get findFirst() {
        return this.prismaService.posts.findFirst
    }

    get createMany() {
        return this.prismaService.posts.createMany
    }

    get findMany() {
        return this.prismaService.posts.findMany
    }

    get deleteMany() {
        return this.prismaService.posts.deleteMany
    }

    get count() {
        return this.prismaService.posts.count
    }
}
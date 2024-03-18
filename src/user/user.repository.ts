import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserRepository {
    constructor(private readonly prismaService: PrismaService) { }

    get create() {
        return this.prismaService.users.create
    }

    get findFirst() {
        return this.prismaService.users.findFirst
    }

    get createMany() {
        return this.prismaService.users.createMany
    }

    get findMany() {
        return this.prismaService.users.findMany
    }

    get deleteMany() {
        return this.prismaService.users.deleteMany
    }
}
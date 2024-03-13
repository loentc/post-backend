import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { CommandRunner, Command } from 'nest-commander';
import { UserService } from './user/user.service';
@Command({
  name: 'seed',
})
export class CommandSeeder extends CommandRunner {
  constructor(private readonly userService: UserService) {
    super();
  }

  async run(): Promise<void> {
    await this.loadData()
    return Promise.resolve(undefined);
  }

  async loadData() {
    const prisma = new PrismaClient()
    try {

      await prisma.$connect()

      await prisma.users.deleteMany()
      console.log('Deleted records in users table')

      await prisma.posts.deleteMany()
      console.log('Deleted records in posts table')

      const rawUser = readFileSync('./users.json', { encoding: 'utf8' })
      const usersJson = JSON.parse(rawUser)
      await this.userService.createMany(usersJson)
      console.log('Seeded users data')

      const rawPosts = readFileSync('./posts.json', { encoding: 'utf8' })
      const postsJson = JSON.parse(rawPosts)
      postsJson.map((item) => {
        item.postedAt = new Date(item.postedAt)
      })

      await prisma.posts.createMany({
        data: postsJson
      })
      console.log('Seeded posts data')



    } catch (e) {
      console.error(e)
      process.exit(1)
    } finally {
      await prisma.$disconnect()
    }
  }
}
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { CommandRunner, Command } from 'nest-commander';
@Command({
  name: 'seed',
})
export class CommandSeeder extends CommandRunner {
  constructor() {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    console.log('CLI Params', passedParams);
    console.log('CLI Options', options);
    await this.loadData()
    return Promise.resolve(undefined);
  }

  async loadData() {
    const prisma = new PrismaClient()
    try {
      // await prisma.users.deleteMany()
      // console.log('Deleted records in users table')
      await prisma.$connect()

      await prisma.posts.deleteMany()
      console.log('Deleted records in posts table')

      const rawData = readFileSync('./posts.json', { encoding: 'utf8' })
      const dataJson = JSON.parse(rawData)
      dataJson.map((item) => {
        item.postedAt = new Date(item.postedAt)
      })

      await prisma.posts.createMany({
        data: dataJson
      })
      console.log('Added posts data')



      // await prisma.$queryRaw`ALTER SEQUENCE Users_id_seq RESTART WITH 0`
      // console.log('reset users auto increment to 1')

      // await prisma.$queryRaw`ALTER TABLE public."Posts" AUTO_INCREMENT = 1`
      // console.log('reset posts auto increment to 1')


      // await prisma.users.createMany({
      //   data: categories
      // })
      // console.log('Added user data')


      // await prisma.posts.createMany({
      //   data: products
      // })

    } catch (e) {
      console.error(e)
      process.exit(1)
    } finally {
      await prisma.$disconnect()
    }
  }
}
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CommandSeeder } from './seeder';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
    imports: [PrismaModule, UserModule, AuthModule, ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }), PostModule],
    controllers: [AppController],
    providers: [AppService, CommandSeeder],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}


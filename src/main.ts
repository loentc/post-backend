import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

const port = process.env.PORT || 8100;

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.listen(port);
    Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();

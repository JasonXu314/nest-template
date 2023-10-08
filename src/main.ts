import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { AppModule } from './app.module';
import { ErrorPageFilter } from './utils/filters/error-page.filter';

config();

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(cookieParser())
		.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
		.useGlobalFilters(new ErrorPageFilter(app.get(HttpAdapterHost).httpAdapter));

	await app.listen(process.env.PORT || 5000);
}
bootstrap();


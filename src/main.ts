import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/http-exception.filter';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());



  /// for Swagger document
  const config = new DocumentBuilder()
    .setTitle('Garden Project Document')
    .setDescription('This is an api document for the project i did for the intern content in Yootek')
    .setVersion('1.0')
    .addBearerAuth() // for JwtToken authentication
    .addTag('Auth')  
    .addTag('Gardens')     
    .addTag('Vegetables')   
    .addTag('Sales')
    .addTag('Device')
    .addTag('User')  
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  // end of "for Swagger document"




  
  app.useGlobalPipes(new ValidationPipe())
  app.useWebSocketAdapter(new IoAdapter(app));

  const configService = new ConfigService();

  await app.listen(Number(configService.get<string>('HOST_PORT')));


  

  
  const appMqtt = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.MQTT,
    options: {
      url: configService.get<string>('MQTT_BROKER_URL')
    },
  });
  await appMqtt.listen();
}
bootstrap();

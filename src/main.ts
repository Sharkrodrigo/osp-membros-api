import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para permitir requisições de outros domínios
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('OSP Membros API')
    .setDescription('API para gerenciamento de usuários e suas mídias')
    .setVersion('1.0')
    .addTag('usuarios')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(3000);
  console.log('Aplicação rodando na porta 3000');
  console.log('Documentação Swagger disponível em: http://localhost:3000/api');
}
bootstrap();

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './usuario/usuario.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '12345',
      database: 'OhOsPapo',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsuarioModule, // <-- IMPORTANTE
  ],
})
export class AppModule {}

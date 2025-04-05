import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { Usuario } from './entities/usuario/usuario';
import { Media } from './entities/media/media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Media])],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [TypeOrmModule],
})
export class UsuarioModule {}

// src/usuario/usuario.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario/usuario';
import { CreateUsuarioDto } from './dto/create-usuario-dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const novoUsuario = this.usuarioRepository.create(createUsuarioDto);
    return this.usuarioRepository.save(novoUsuario);
  }
}

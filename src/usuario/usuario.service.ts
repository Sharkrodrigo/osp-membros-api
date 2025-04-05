// src/usuario/usuario.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario/usuario';
import { Media } from './entities/media/media.entity';
import { CreateUsuarioDto } from './dto/create-usuario-dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CreateMediaDto } from './dto/create-media.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
  ) {}

  findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const novoUsuario = this.usuarioRepository.create(createUsuarioDto);
    return this.usuarioRepository.save(novoUsuario);
  }

  async findUsuarioById(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findUsuarioById(id);
    
    // Atualizar apenas os campos fornecidos
    Object.assign(usuario, updateUsuarioDto);
    
    return this.usuarioRepository.save(usuario);
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.findUsuarioById(id);
    await this.usuarioRepository.remove(usuario);
  }

  // Media methods
  async createMedia(createMediaDto: CreateMediaDto): Promise<Media> {
    const usuario = await this.findUsuarioById(createMediaDto.usuarioId);
    
    const media = this.mediaRepository.create({
      ...createMediaDto,
      usuario,
    });
    
    return this.mediaRepository.save(media);
  }

  async findAllMediaByUsuarioId(usuarioId: number): Promise<Media[]> {
    // Verify user exists
    await this.findUsuarioById(usuarioId);
    
    return this.mediaRepository.find({
      where: { usuarioId },
      order: { uploadedAt: 'DESC' },
    });
  }

  async findMediaById(id: number): Promise<Media> {
    const media = await this.mediaRepository.findOne({ 
      where: { id },
      relations: ['usuario'],
    });
    
    if (!media) {
      throw new NotFoundException(`Media com ID ${id} não encontrada`);
    }
    
    return media;
  }

  async deleteMedia(id: number): Promise<void> {
    const media = await this.findMediaById(id);
    await this.mediaRepository.remove(media);
  }
}

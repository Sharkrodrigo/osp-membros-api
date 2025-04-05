import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../usuario/usuario';

export enum MediaType {
  IMAGE = 'image',
  AUDIO = 'audio',
}

@Entity()
export class Media {
  @ApiProperty({
    description: 'ID único da mídia',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Nome do arquivo no sistema',
    example: 'f8a7b6c5d4e3.jpg',
  })
  @Column()
  filename: string;

  @ApiProperty({
    description: 'Nome original do arquivo',
    example: 'foto_perfil.jpg',
  })
  @Column()
  originalname: string;

  @ApiProperty({
    description: 'Tipo MIME do arquivo',
    example: 'image/jpeg',
  })
  @Column()
  mimetype: string;

  @ApiProperty({
    description: 'Caminho do arquivo no sistema',
    example: 'uploads/f8a7b6c5d4e3.jpg',
  })
  @Column()
  path: string;

  @ApiProperty({
    description: 'Tamanho do arquivo em bytes',
    example: 1024000,
  })
  @Column()
  size: number;

  @ApiProperty({
    description: 'Tipo de mídia',
    enum: MediaType,
    example: MediaType.IMAGE,
  })
  @Column({
    type: 'enum',
    enum: MediaType,
  })
  type: MediaType;

  @ApiProperty({
    description: 'Data e hora do upload',
    example: '2025-04-05T15:30:00Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;

  @ApiProperty({
    description: 'Usuário proprietário da mídia',
    type: () => Usuario,
  })
  @ManyToOne(() => Usuario, usuario => usuario.medias)
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @ApiProperty({
    description: 'ID do usuário proprietário da mídia',
    example: 1,
  })
  @Column()
  usuarioId: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '../entities/media/media.entity';

export class CreateMediaDto {
  @ApiProperty({
    description: 'Nome do arquivo no sistema',
    example: 'f8a7b6c5d4e3.jpg',
  })
  filename: string;

  @ApiProperty({
    description: 'Nome original do arquivo',
    example: 'foto_perfil.jpg',
  })
  originalname: string;

  @ApiProperty({
    description: 'Tipo MIME do arquivo',
    example: 'image/jpeg',
  })
  mimetype: string;

  @ApiProperty({
    description: 'Caminho do arquivo no sistema',
    example: 'uploads/f8a7b6c5d4e3.jpg',
  })
  path: string;

  @ApiProperty({
    description: 'Tamanho do arquivo em bytes',
    example: 1024000,
  })
  size: number;

  @ApiProperty({
    description: 'Tipo de mídia (imagem ou áudio)',
    enum: MediaType,
    example: MediaType.IMAGE,
  })
  type: MediaType;

  @ApiProperty({
    description: 'ID do usuário proprietário da mídia',
    example: 1,
  })
  usuarioId: number;
}

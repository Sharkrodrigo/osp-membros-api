import { ApiProperty } from '@nestjs/swagger';

export class UpdateUsuarioDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
    required: false,
  })
  nome?: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@exemplo.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha123',
    required: false,
  })
  senha?: string;
}

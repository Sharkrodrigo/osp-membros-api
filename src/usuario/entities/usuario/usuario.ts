import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Media } from '../media/media.entity';

@Entity()
export class Usuario {
  @ApiProperty({
    description: 'ID único do usuário',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
  })
  @Column()
  nome: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@exemplo.com',
  })
  @Column()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha123',
  })
  @Column()
  senha: string;

  @ApiProperty({
    description: 'Mídias associadas ao usuário',
    type: () => [Media],
  })
  @OneToMany(() => Media, media => media.usuario)
  medias: Media[];
}

import { 
  Controller, 
  Get, 
  Post, 
  Put,
  Body, 
  Param, 
  Delete, 
  UseInterceptors, 
  UploadedFile,
  ParseIntPipe,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsuarioService } from './usuario.service';
import { Usuario } from './entities/usuario/usuario';
import { Media, MediaType } from './entities/media/media.entity';
import { CreateUsuarioDto } from './dto/create-usuario-dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CreateMediaDto } from './dto/create-media.dto';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiConsumes, 
  ApiBody,
  ApiProperty
} from '@nestjs/swagger';

// Define the file interface to avoid TypeScript errors
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

// DTO para documentação do upload de arquivo
class FileUploadDto {
  @ApiProperty({
    description: 'Arquivo a ser enviado (imagem ou áudio)',
    type: 'string',
    format: 'binary',
  })
  file: any;
}

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuários retornada com sucesso',
    type: [Usuario]
  })
  @Get()
  findAll(): Promise<Usuario[]> {
    return this.usuarioService.findAll();
  }

  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuário criado com sucesso',
    type: Usuario
  })
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.create(createUsuarioDto);
  }

  @ApiOperation({ summary: 'Buscar um usuário pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuário encontrado com sucesso',
    type: Usuario
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado'
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Usuario> {
    return this.usuarioService.findUsuarioById(id);
  }

  @ApiOperation({ summary: 'Atualizar um usuário pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuário atualizado com sucesso',
    type: Usuario
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado'
  })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @ApiOperation({ summary: 'Excluir um usuário pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuário excluído com sucesso'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado'
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usuarioService.remove(id);
  }

  // Media endpoints
  @ApiTags('usuarios')
  @ApiOperation({ summary: 'Fazer upload de mídia para um usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Arquivo de mídia (imagem ou áudio)',
    type: FileUploadDto,
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Mídia enviada com sucesso',
    type: Media
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Tipo de arquivo não suportado ou dados inválidos'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado'
  })
  @Post(':id/media')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          // Generate a unique filename
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req: any, file, cb) => {
        // Check if file is an image or audio
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          req.fileType = MediaType.IMAGE;
          cb(null, true);
        } else if (file.mimetype.match(/\/(mpeg|mp3|wav|ogg)$/)) {
          req.fileType = MediaType.AUDIO;
          cb(null, true);
        } else {
          cb(new BadRequestException('Tipo de arquivo não suportado'), false);
        }
      },
    }),
  )
  async uploadMedia(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: MulterFile,
    @Body() body: any,
  ): Promise<Media> {
    // Verify user exists
    await this.usuarioService.findUsuarioById(id);

    // Determine file type
    let fileType = MediaType.IMAGE;
    if (file.mimetype.match(/\/(mpeg|mp3|wav|ogg)$/)) {
      fileType = MediaType.AUDIO;
    }

    const createMediaDto: CreateMediaDto = {
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      path: file.path,
      size: file.size,
      type: fileType,
      usuarioId: id,
    };

    return this.usuarioService.createMedia(createMediaDto);
  }

  @ApiTags('usuarios')
  @ApiOperation({ summary: 'Listar todas as mídias de um usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de mídias retornada com sucesso',
    type: [Media]
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado'
  })
  @Get(':id/media')
  findAllMedia(@Param('id', ParseIntPipe) id: number): Promise<Media[]> {
    return this.usuarioService.findAllMediaByUsuarioId(id);
  }

  @ApiTags('usuarios')
  @ApiOperation({ summary: 'Buscar uma mídia pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da mídia' })
  @ApiResponse({ 
    status: 200, 
    description: 'Mídia encontrada com sucesso',
    type: Media
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Mídia não encontrada'
  })
  @Get('media/:id')
  findOneMedia(@Param('id', ParseIntPipe) id: number): Promise<Media> {
    return this.usuarioService.findMediaById(id);
  }

  @ApiTags('usuarios')
  @ApiOperation({ summary: 'Excluir uma mídia pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da mídia' })
  @ApiResponse({ 
    status: 200, 
    description: 'Mídia excluída com sucesso'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Mídia não encontrada'
  })
  @Delete('media/:id')
  deleteMedia(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usuarioService.deleteMedia(id);
  }
}

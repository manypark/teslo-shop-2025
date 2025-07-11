import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';

import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';

@Controller('files')
export class FilesController {

  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter : fileFilter,
    limits: { fieldSize: 5000 },
    storage: diskStorage({
      destination : './static/uploads',
      filename    : fileNamer
    })
  }))
  uoloadFileImage( 
    @UploadedFile() file : Express.Multer.File,
  ) {

    if( !file ) throw new BadRequestException('Make sure that the file is an image');

    return { filedName : file.originalname };
  }

}

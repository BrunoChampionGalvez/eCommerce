import { Controller, FileTypeValidator, HttpCode, MaxFileSizeValidator, Param, ParseFilePipe, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from "./cloudinary.service";
import { AuthGuard } from "src/guards/auth.guard";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";

@ApiTags('Cloudinary')
@Controller('files')
export class CloudinaryController {
    constructor(private readonly cloudinaryService: CloudinaryService) {}

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Put('products/uploadImage/:id')
    @HttpCode(200)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Subir imagen',
        type: 'multipart/form-data',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        }
    })
    @UseInterceptors(FileInterceptor('image'))
    uploadImage(
        @Param('id') id: string,
        @UploadedFile(new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({
                    maxSize: 200000,
                    message: 'La imagen no debe ser mayor a 200kb.'
                }),
                new FileTypeValidator({
                    fileType: /jpg|jpeg|png|webp/
                })
            ]
        })) file: Express.Multer.File) {
            return this.cloudinaryService.uploadImage(id, file)
    }
}
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import toStream = require('buffer-to-stream');
import { v2 } from "cloudinary";
import { response } from "express";
import { Product } from "src/products/products.entity";
import { Repository } from "typeorm";
import { CloudinaryResponse } from "./cloudinaryResponse";

@Injectable()
export class CloudinaryService {
    constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>) {}

    uploadImage(id: string, file: Express.Multer.File) {
        const cloudinaryPromise = new Promise<CloudinaryResponse>((resolve, reject) => {
            const upload = v2.uploader.upload_stream(
                { resource_type: 'auto' },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                },
            );
            toStream(file.buffer).pipe(upload);
        });

        cloudinaryPromise.then((response) => {
            this.productRepository.update({ id }, {imgUrl: response.secure_url})
        })

        return 'Imagen de producto actualizada.'
    }
}
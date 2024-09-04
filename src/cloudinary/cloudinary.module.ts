import { Module } from "@nestjs/common";
import { CloudinaryConfig } from "src/config/cloudinary";
import { CloudinaryController } from "./cloudinary.controller";
import { CloudinaryService } from "./cloudinary.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "src/products/products.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Product])],
    providers: [CloudinaryConfig, CloudinaryService],
    controllers: [CloudinaryController]
})
export class CloudinaryModule {}
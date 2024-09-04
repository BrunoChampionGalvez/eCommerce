import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./products.entity";
import { Repository } from "typeorm";
import { Category } from "src/categories/categories.entity";
const toStream = require('buffer-to-stream')
import { v2 } from "cloudinary";
import { CloudinaryResponse } from "src/cloudinary/cloudinaryResponse";
import { OrderDetail } from "src/orderDetails/orderDetails.entity";
import { Order } from "src/orders/orders.entity";

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product) private readonly productsRepository: Repository<Product>,
        @InjectRepository(Category) private readonly categoriesRepository: Repository<Category>,
        @InjectRepository(OrderDetail) private readonly orderdetailsRepository: Repository<OrderDetail>,
        @InjectRepository(Order) private readonly ordersRepository: Repository<Order>
    ) { }

    private products = [
        {
            name: "Iphone 15",
            description: "The best smartphone in the world",
            price: 199.99,
            stock: 12,
            imgUrl: 'example-url-1',
            category: "smartphone"
        },
        {
            name: "Samsung Galaxy S23",
            description: "The best smartphone in the world",
            price: 150.0,
            stock: 12,
            imgUrl: 'example-url-2',
            category: "smartphone"
        },
        {
            name: "Motorola Edge 40",
            description: "The best smartphone in the world",
            price: 179.89,
            stock: 12,
            imgUrl: 'example-url-3',
            category: "smartphone"
        },
        {
            name: "Samsung Odyssey G9",
            description: "The best monitor in the world",
            price: 299.99,
            stock: 12,
            imgUrl: 'example-url-4',
            category: "monitor"
        },
        {
            name: "LG UltraGear",
            description: "The best monitor in the world",
            price: 199.99,
            stock: 12,
            imgUrl: 'example-url-5',
            category: "monitor"
        },
        {
            name: "Acer Predator",
            description: "The best monitor in the world",
            price: 150.0,
            stock: 12,
            imgUrl: 'example-url-6',
            category: "monitor"
        },
        {
            name: "Razer BlackWidow V3",
            description: "The best keyboard in the world",
            price: 99.99,
            stock: 12,
            imgUrl: 'example-url-7',
            category: "keyboard"
        },
        {
            name: "Corsair K70",
            description: "The best keyboard in the world",
            price: 79.99,
            stock: 12,
            imgUrl: 'example-url-8',
            category: "keyboard"
        },
        {
            name: "Logitech G Pro",
            description: "The best keyboard in the world",
            price: 59.99,
            stock: 12,
            imgUrl: 'example-url-9',
            category: "keyboard"
        },
        {
            name: "Razer Viper",
            description: "The best mouse in the world",
            price: 49.99,
            stock: 12,
            imgUrl: 'example-url-10',
            category: "mouse"
        },
        {
            name: "Logitech G502 Pro",
            description: "The best mouse in the world",
            price: 39.99,
            stock: 12,
            imgUrl: 'example-url-11',
            category: "mouse"
        },
        {
            name: "SteelSeries Rival 3",
            description: "The best mouse in the world",
            price: 29.99,
            stock: 12,
            imgUrl: 'example-url-12',
            category: "mouse"
        }
    ]

    async getProducts(page: number, limit: number) {
        const products = await this.productsRepository.find()
        const start = (page - 1) * limit
        const end = start + limit
        return products.slice(start, end)
    }

    async getProductById(id: string) {
        const product = await this.productsRepository.findOneBy({ id })
        if (product) return product
        throw new NotFoundException('Producto no encontrado.')
    }

    async createProduct(product) {
        
        return await this.productsRepository.save(product)
    }

    async updateProduct(id: string, product) {
        const newProduct = await this.productsRepository.findOneBy({ id })
        if (newProduct) {
            await this.productsRepository.update({ id }, product)
            return {updated: true}
        }
        throw new NotFoundException('Producto no encontrado.')
    }

    async uploadImage(id: string, file: Express.Multer.File) {
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
            this.productsRepository.update({ id }, { imgUrl: response.secure_url })
        })

        return 'Imagen de producto actualizada.'
    }

    async deleteProduct(id: string) {
        const product = await this.productsRepository.findOneBy({ id })
        const orderDetails = await this.orderdetailsRepository.find({ relations: ['products'], select: { products: { id: true } } })
        for (const orderDetail of orderDetails) {
            for (const newProduct of orderDetail.products) {
                if (newProduct.id === product.id) {
                    throw new BadRequestException('No se puede eliminar el producto porque pertenece a una orden.')
                }
            }
        }
        if (product) {
            await this.productsRepository.delete({ id })
            return {deleted: true}
        }
        throw new NotFoundException('Producto no encontrado.')
    }

    async addProducts() {
        let newProducts = []
        let ordersDeleted = false
        const orderDetails = await this.orderdetailsRepository.find({relations: ["products", "order"], select: {id: true, products: { name: true}}})
        for (const product of this.products) {
            // Verifica que algún producto del seeder no pertenezca a un detalle de orden, si pertenece, la elimina junto con la orden vinculada.
            for (const orderDetail of orderDetails) {
                for (const newProduct of orderDetail.products) {
                    if (newProduct.name === product.name) {
                        const order = await this.ordersRepository.findOne({ where: { orderDetail: { id: orderDetail.id } }, relations: {orderDetail: true} })
                        if (order) {
                            order.orderDetail = null;
                            orderDetail.order = null;
    
                            await this.ordersRepository.save(order)
                            await this.orderdetailsRepository.save(orderDetail)
    
                            await this.ordersRepository.delete({ id: order.id })
                            await this.orderdetailsRepository.delete({ id: orderDetail.id })
                            
                            ordersDeleted = true
                        }
                    }
                }
            }
            //Reinicia los productos
            const oldProduct = await this.productsRepository.findOneBy({ name: product.name })
            if (!oldProduct) {
                let category = await this.categoriesRepository.findOne({ where: { name: product.category } })
                await this.productsRepository.save({ ...product, category: category })
                newProducts.push(product)
            }
        }
        if (ordersDeleted) {
            return 'Algunos productos ya pertenecían a algunos detalles de órdenes, por lo que al reiniciarlos se eliminaron los detalles de órdenes y las órdenes a las que pertenecían.'
        }
        if (newProducts.length > 0) {
            return "Productos precargados con éxito."
        }
        else {
            return 'Los productos ya se encontraban precargados.'
        }
    }
}
import { Category } from "src/categories/categories.entity";
import { OrderDetail } from "src/orderDetails/orderDetails.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({length: 50, nullable: false})
    name: string

    @Column({type: 'text', nullable: false})
    description: string

    @Column({type: 'decimal', precision: 10, scale: 2, nullable: false})
    price: number

    @Column({type: 'int', nullable: false})
    stock: number

    @Column({ type: 'text', default: 'example-img-url'})
    imgUrl: string

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: 'category_id' })
    category: Category

    @ManyToMany(() => OrderDetail, (orderDetail) => orderDetail.products)
    orderDetails: OrderDetail[];
}
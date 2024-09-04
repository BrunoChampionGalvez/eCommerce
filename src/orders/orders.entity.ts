import { OrderDetail } from "src/orderDetails/orderDetails.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'orders' })
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    date: string

    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn({name: 'user_id'})
    user: User

    @OneToOne(() => OrderDetail)
    @JoinColumn({name: 'orderDetail_id'})
    orderDetail: OrderDetail
}
import { Role } from "src/enums/Role";
import { Order } from "src/orders/orders.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ length: 50, nullable: false, unique: true })
    email: string
    
    @Column({ length: 50, nullable: false })
    name: string
    
    @Column({ length: 80, nullable: false })
    password: string
    
    @Column({type: 'text'})
    address: string
    
    @Column({type: 'int'})
    phone: number
    
    @Column({length: 50})
    country?: string | undefined
    
    @Column({length: 50})
    city?: string | undefined

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[]

    @Column({ default: Role.User })
    roles: Role
}
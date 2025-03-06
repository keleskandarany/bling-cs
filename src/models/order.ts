import {
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product';
import { User } from './user';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Product)
  @JoinTable({
    name: 'order_products',
  })
  products: Product[];

  @ManyToOne(() => User, (user) => user.orders)
  user: User;
}

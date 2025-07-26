import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { OrderItem } from './OrderItem';
import { User } from './User';

@Entity()
export class Order {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @ManyToOne()
  user!: User;

  @OneToMany(() => OrderItem, (item) => item.order)
  items = new Collection<OrderItem>(this);

  @Property({ onCreate: () => new Date() })
  createdAt?: Date = new Date();
}

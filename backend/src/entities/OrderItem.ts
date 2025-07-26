import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Order } from './Order';

@Entity()
export class OrderItem {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @ManyToOne()
  order!: Order;

  @Property()
  productId!: string; // keep reference id

  @Property()
  productName!: string;

  @Property()
  price!: number;

  @Property()
  quantity!: number;
}

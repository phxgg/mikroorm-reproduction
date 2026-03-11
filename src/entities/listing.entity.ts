import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/decorators/legacy';
import { type Ref } from '@mikro-orm/sqlite';
import { Contact } from './contact.entity';

@Entity()
export class Listing {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Contact, ref: true, eager: true })
  contact: Ref<Contact>;
}

import { Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { Collection } from '@mikro-orm/sqlite';
import { Listing } from './listing.entity';

@Entity()
export class Contact {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @OneToMany({ entity: () => Listing, mappedBy: (listing) => listing.contact })
  listings = new Collection<Listing>(this);
}

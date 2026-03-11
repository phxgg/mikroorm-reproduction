import { ReflectMetadataProvider } from '@mikro-orm/decorators/legacy';
import { MikroORM } from '@mikro-orm/sqlite';
import { Contact } from './entities/contact.entity';
import { Listing } from './entities/listing.entity';

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init({
    metadataProvider: ReflectMetadataProvider,
    dbName: 'sqlite.db',
    entities: ['dist/**/entities/*.entity.js'],
    entitiesTs: ['src/**/entities/*.entity.ts'],
    preferTs: true,
    debug: ['query', 'query-params'],
    allowGlobalContext: true, // only for testing
  });
  await orm.schema.refresh();
});

afterAll(async () => {
  await orm.close(true);
});

test('fill in some data', async () => {
  const contact1 = orm.em.create(Contact, { id: 1, name: 'foo' });
  const contact2 = orm.em.create(Contact, { id: 2, name: 'bar' });
  const listing = orm.em.create(Listing, { id: 1, contact: contact1 });

  await orm.em.flush();
  orm.em.clear();

  const loadedListing = await orm.em.findOneOrFail(Listing, { id: listing.id });
  const json = loadedListing.contact.toJSON();
  expect(json.name).toEqual('foo');
});

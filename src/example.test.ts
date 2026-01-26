import { Collection, Entity, ManyToMany, ManyToOne, MikroORM, PrimaryKey, Property, type Ref } from '@mikro-orm/sqlite';

@Entity()
class Role {
  @PrimaryKey()
  id!: number;

  @Property()
  name: string;
}

@Entity()
class User {

  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @Property({ unique: true })
  email: string;

  // eager set to true
  @ManyToMany({ entity: () => Role, eager: true })
  roles = new Collection<Role>(this);
}

@Entity()
class Post {
  @PrimaryKey()
  id!: number;

  @Property()
  title: string;

  // eager set to false
  @ManyToOne({ entity: () => User, ref: true, eager: false })
  createdBy: Ref<User>;
}

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init({
    dbName: ':memory:',
    entities: [Role, User, Post],
    debug: ['query', 'query-params'],
    allowGlobalContext: true, // only for testing
  });
  await orm.schema.refreshDatabase();
});

afterAll(async () => {
  await orm.close(true);
});

test('eager loading with exclusions', async () => {
  const role = orm.em.create(Role, { name: 'Test Role' });
  const user = orm.em.create(User, { name: 'Foo', email: 'foo', roles: [role] });
  const post = orm.em.create(Post, { title: 'Hello World', createdBy: user });

  await orm.em.flush();
  orm.em.clear();

  const loadedPost = await orm.em.findOneOrFail(Post, { id: post.id }, { populate: ['createdBy'], exclude: ['createdBy.name', 'createdBy.roles'] });
  const json = loadedPost.createdBy.toJSON();
  expect(json.roles).toBe(undefined);
});

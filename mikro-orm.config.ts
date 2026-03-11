import { ReflectMetadataProvider } from '@mikro-orm/decorators/legacy';
import { defineConfig, SqliteDriver } from '@mikro-orm/sqlite';

export default defineConfig({
  metadataProvider: ReflectMetadataProvider,
  preferTs: true,
  driver: SqliteDriver,
  dbName: 'sqlite.db',
  entities: ['dist/**/entities/*.entity.js'],
  entitiesTs: ['src/**/entities/*.entity.ts'],
});

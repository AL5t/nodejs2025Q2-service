import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule } from './albums/albums.module';
import { FavoritesModule } from './favotites/favorites.module';
import { DocsModule } from './doc/doc.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'db',
      port: +(process.env.POSTGRES_PORT || 5432),
      username: process.env.POSTGRES_USER || 'admin',
      password: process.env.POSTGRES_PASSWORD || '123qwe',
      database: process.env.POSTGRES_DB || 'hlsdb',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      migrationsRun: false,
    }),
    UsersModule,
    TracksModule,
    ArtistsModule,
    AlbumsModule,
    FavoritesModule,
    DocsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

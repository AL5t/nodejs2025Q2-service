import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule } from './albums/albums.module';
import { FavoritesModule } from './favotites/favorites.module';
import { DocsModule } from './doc/doc.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { FileLoggerService } from './logging/logging.service';
import { AllExceptionsFilter } from './logging/http-exception.filter';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from './app.service';

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
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY || 'secret123123',
    }),
    UsersModule,
    TracksModule,
    ArtistsModule,
    AlbumsModule,
    FavoritesModule,
    DocsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: 'LoggingService', useClass: FileLoggerService },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    AppService,
  ],
})
export class AppModule {}

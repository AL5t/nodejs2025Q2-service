import { Album } from 'src/albums/albums.entity';
import { Artist } from 'src/artists/artists.entity';
import { Track } from 'src/tracks/track.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @VersionColumn()
  version: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Artist, { cascade: false })
  @JoinTable({
    name: 'favorites_artists',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'artist_id', referencedColumnName: 'id' },
  })
  favoritesArtits: Artist[];

  @ManyToMany(() => Album, { cascade: false })
  @JoinTable({
    name: 'favorites_albums',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'album_id', referencedColumnName: 'id' },
  })
  favoritesAlbums: Album[];

  @ManyToMany(() => Track, { cascade: false })
  @JoinTable({
    name: 'favorites_tracks',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'track_id', referencedColumnName: 'id' },
  })
  favoritesTracks: Track[];
}

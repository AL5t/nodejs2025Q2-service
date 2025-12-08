import { Album } from 'src/albums/albums.entity';
import { Artist } from 'src/artists/artists.entity';
import { Track } from 'src/tracks/track.entity';
import { Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'favorites' })
export class Favorites {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Artist, { onDelete: 'CASCADE' })
  @JoinTable()
  artists: Artist[];

  @ManyToMany(() => Album, { onDelete: 'CASCADE' })
  @JoinTable()
  albums: Album[];

  @ManyToMany(() => Track, { onDelete: 'CASCADE' })
  @JoinTable()
  tracks: Track[];
}

import { Artist } from 'src/artists/artists.entity';
import { Track } from 'src/tracks/track.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'albums' })
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('int')
  year: number;

  @ManyToOne(() => Artist, (artist) => artist.albums, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({name: 'artistId'})
  artist: Artist | null;

  @OneToMany(() => Track, (track) => track.album)
  tracks: Track[];
}

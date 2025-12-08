import { Album } from 'src/albums/albums.entity';
import { Artist } from 'src/artists/artists.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'tracks' })
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('int')
  duration: number;

  @Column({ type: 'uuid', nullable: true })
  artistId: string | null;
  
  @Column({ type: 'uuid', nullable: true })
  albumId: string | null;

  @ManyToOne(() => Artist, (artist) => artist.tracks, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({name: 'artistId'})
  artist: Artist | null;

  @ManyToOne(() => Album, (album) => album.tracks, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({name: 'albumId'})
  album: Album | null;
}

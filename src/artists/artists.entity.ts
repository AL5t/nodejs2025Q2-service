import { Album } from 'src/albums/albums.entity';
import { Track } from 'src/tracks/track.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'artists' })
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
  
  @Column({ default: false })
  grammy: boolean;

  @OneToMany(() => Album, (album) => album.artist)
  albums: Album[];

  @OneToMany(() => Track, (track) => track.artist)
  tracks: Track[];
}

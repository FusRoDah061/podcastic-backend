import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('episodes')
export default class Episode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'podcast_id', nullable: false })
  podcastId: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: false, type: 'timestamp with time zone' })
  date: Date;

  @Column({ nullable: false })
  image: string;

  @Column({ nullable: false })
  duration: string;

  @Column({ name: 'exists_on_feed', nullable: true })
  existsOnFeed?: boolean;

  @Column({ nullable: false })
  url: string;

  @Column({
    name: 'media_type',
    nullable: false,
  })
  mediaType: string;

  @Column({ name: 'size_bytes', nullable: false })
  sizeBytes: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

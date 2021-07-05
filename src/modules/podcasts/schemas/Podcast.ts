import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('podcasts')
export default class Podcast {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ name: 'image_url', nullable: false })
  imageUrl: string;

  @Column({ name: 'website_url', nullable: true })
  websiteUrl?: string;

  @Column({ name: 'feed_url', unique: true, nullable: false })
  @Index({ unique: true, fulltext: true })
  feedUrl: string;

  @Column({ name: 'is_service_available', nullable: true })
  isServiceAvailable?: boolean;

  @Column({
    name: 'last_successful_healthcheck_at',
    nullable: true,
    type: 'timestamp with time zone',
  })
  lastSuccessfulHealthcheckAt: Date;

  @Column({ name: 'theme_color', nullable: true })
  themeColor?: string;

  @Column({ name: 'text_color', nullable: true })
  textColor?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

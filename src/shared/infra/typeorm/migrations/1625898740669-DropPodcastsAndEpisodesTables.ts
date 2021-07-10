import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export default class DropPodcastsAndEpisodesTables1625898740669
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.dropTable('podcasts'),
      queryRunner.dropTable('episodes'),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'podcasts',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'image_url',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'website_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'feed_url',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'is_service_available',
            type: 'boolean',
            comment:
              'Boolean value indicating weather the podcast feed is available',
            isNullable: true,
            default: true,
          },
          {
            name: 'last_successful_healthcheck_at',
            type: 'timestamp with time zone',
            comment:
              'Last time there was a successful (2xx) request on the feed url',
            isNullable: true,
            default: 'now()',
          },
          {
            name: 'theme_color',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'text_color',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'podcasts',
      new TableIndex({
        name: 'i_podcasts_feed_url',
        columnNames: ['feed_url'],
        isUnique: true,
        isFulltext: true,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'episodes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'podcast_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'date',
            type: 'timestamp with time zone',
            comment: 'Publish date',
            isNullable: false,
          },
          {
            name: 'image',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'duration',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'exists_on_feed',
            type: 'boolean',
            comment:
              'Boolean value indicating weather the episode is still available at the feed',
            isNullable: true,
            default: true,
          },
          {
            name: 'url',
            type: 'varchar',
            comment: 'Episode media url',
            isNullable: false,
          },
          {
            name: 'media_type',
            type: 'varchar',
            comment: 'Episode media type (mp3, mpeg, etc)',
            isNullable: false,
          },
          {
            name: 'size_bytes',
            type: 'integer',
            comment: 'Episode media size in bytes',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'podcasts_episodes',
            referencedTableName: 'podcasts',
            referencedColumnNames: ['id'],
            columnNames: ['podcast_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }
}

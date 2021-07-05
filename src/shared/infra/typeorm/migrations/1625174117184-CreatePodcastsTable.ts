import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export default class CreatePodcastsTable1625174117184
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('podcasts', 'i_podcasts_feed_url');
    await queryRunner.dropTable('podcasts');
  }
}

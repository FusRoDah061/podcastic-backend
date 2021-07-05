import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateEpisodesTable1625175556673
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
            isNullable: false,
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('episodes');
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export default class SetEpisodeDurationNullable1625781212583
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE episodes ALTER COLUMN duration DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE episodes ALTER COLUMN duration SET NOT NULL`,
    );
  }
}

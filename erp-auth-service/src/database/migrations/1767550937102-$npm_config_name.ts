import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1767550937102 implements MigrationInterface {
  name = ' $npmConfigName1767550937102';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "isBlock" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isBlock"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1767550119163 implements MigrationInterface {
  name = ' $npmConfigName1767550119163';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "permissions" ("id" SERIAL NOT NULL, "name" character varying(120) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_48ce552495d14eae9b187bb671" ON "permissions" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_648e3f5447f725579d7d4ffdfb" ON "roles" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(120) NOT NULL, "email" character varying(150) NOT NULL, "password" character varying NOT NULL, "status" boolean NOT NULL DEFAULT true, "isEmailVerified" boolean NOT NULL DEFAULT false, "emailVerificationToken" character varying, "emailVerificationTokenExpries" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_603379383366b71239acc25e26" ON "users" ("createdAt", "id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "refresh_token" ("id" SERIAL NOT NULL, "tokenHash" character varying NOT NULL, "revoked" boolean NOT NULL DEFAULT false, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "expiresAt" TIMESTAMP, "user_id" integer, CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "employees" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "employeeCode" character varying NOT NULL, "designation" character varying NOT NULL, "department" character varying, "employmentType" "public"."employees_employmenttype_enum" NOT NULL DEFAULT 'full_time', "status" "public"."employees_status_enum" NOT NULL DEFAULT 'active', "joiningDate" date NOT NULL, "phone" character varying, "emergencyContactNumber" character varying, "emergencyContactRelation" character varying, "nidNumber" character varying, "picture" character varying, "presentAddress" text, "permanentAddress" text, "basicSalary" numeric(12,2) NOT NULL DEFAULT '0', "accountNumber" character varying, "bankName" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "user_id" integer NOT NULL, CONSTRAINT "UQ_e3d0372d1ebe64cf827743666ce" UNIQUE ("employeeCode"), CONSTRAINT "REL_2d83c53c3e553a48dadb9722e3" UNIQUE ("user_id"), CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_EMPLOYEE_CODE" ON "employees" ("employeeCode") `,
    );
    await queryRunner.query(
      `CREATE TABLE "role_permissions" ("role_id" integer NOT NULL, "permission_id" integer NOT NULL, CONSTRAINT "PK_25d24010f53bb80b78e412c9656" PRIMARY KEY ("role_id", "permission_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_178199805b901ccd220ab7740e" ON "role_permissions" ("role_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_17022daf3f885f7d35423e9971" ON "role_permissions" ("permission_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_roles" ("user_id" integer NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("user_id", "role_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_6bbe63d2fe75e7f0ba1710351d4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "employees" ADD CONSTRAINT "FK_2d83c53c3e553a48dadb9722e38" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employees" DROP CONSTRAINT "FK_2d83c53c3e553a48dadb9722e38"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_6bbe63d2fe75e7f0ba1710351d4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b23c65e50a758245a33ee35fda"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_87b8888186ca9769c960e92687"`,
    );
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_17022daf3f885f7d35423e9971"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_178199805b901ccd220ab7740e"`,
    );
    await queryRunner.query(`DROP TABLE "role_permissions"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EMPLOYEE_CODE"`);
    await queryRunner.query(`DROP TABLE "employees"`);
    await queryRunner.query(`DROP TABLE "refresh_token"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_603379383366b71239acc25e26"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_648e3f5447f725579d7d4ffdfb"`,
    );
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_48ce552495d14eae9b187bb671"`,
    );
    await queryRunner.query(`DROP TABLE "permissions"`);
  }
}

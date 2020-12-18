import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class courses1608299617314 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
            name: 'courses',
            columns: [
                {
                  name: 'id',
                  type: 'varchar',
                  isPrimary: true,
                  generationStrategy: 'uuid',
                },
                {
                  name: 'name',
                  type: 'varchar',
                  isNullable: false,
                },
                {
                  name: 'image',
                  type: 'varchar',
                  isNullable: false,
                },
            ],
        })
    )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('courses');
    }

}

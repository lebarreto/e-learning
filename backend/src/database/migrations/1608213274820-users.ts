import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class users1608213274820 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                      name: 'id',
                      type: 'varchar',
                      isPrimary: true,
                      generationStrategy: 'uuid',
                    },
                    {
                      name: 'username',
                      type: 'varchar',
                      isNullable: false,
                    },
                    {
                      name: 'password',
                      type: 'varchar',
                      isNullable: false,
                    },
                  ],
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }

}

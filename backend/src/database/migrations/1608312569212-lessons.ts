import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class lessons1608312569212 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
            name: 'lessons',
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
                  name: 'duration',
                  type: 'integer',
                  isNullable: false,
                },
                {
                  name: 'description',
                  type: 'varchar',
                  isNullable: true,
                },
                {
                  name: 'video_id',
                  type: 'varchar',
                  isNullable: false,
                },
                {
                  name: 'course_id',
                  type: 'varchar',
                  isNullable: false,
                },
              ],
        })
      )

      await queryRunner.createForeignKey(
        'lessons',
        new TableForeignKey({
          name: 'LessonsCourse',
          columnNames: ['course_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'courses',
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        }),
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey('lessons', 'LessonsCourse');
      await queryRunner.dropTable('lessons');
    }

}

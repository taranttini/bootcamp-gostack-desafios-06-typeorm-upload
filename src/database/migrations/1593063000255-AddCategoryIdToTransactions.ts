import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddCategoryIdToTransactions1593063000255
  implements MigrationInterface {
  TB_CATEGORIES = 'categories';
  TB_TRANSACTIONS = 'transactions';
  FK_TRANSACTIONS_CATEGORY = 'transaction_category';
  COL_CATEGORY_ID = 'category_id';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      this.TB_TRANSACTIONS,
      new TableColumn({
        name: this.COL_CATEGORY_ID,
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      this.TB_TRANSACTIONS,
      new TableForeignKey({
        name: this.FK_TRANSACTIONS_CATEGORY,
        columnNames: [this.COL_CATEGORY_ID],
        referencedColumnNames: ['id'],
        referencedTableName: this.TB_CATEGORIES,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey(
      this.TB_TRANSACTIONS,
      this.FK_TRANSACTIONS_CATEGORY,
    );

    await queryRunner.dropColumn(this.TB_TRANSACTIONS, this.COL_CATEGORY_ID);
  }
}

import { EntityRepository, Repository } from 'typeorm';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const balance = await this.createQueryBuilder()
      .select('type')
      .addSelect('sum(value)', 'sum')
      .groupBy('type')
      .getRawMany();

    // const b = await this.createQueryBuilder()
    //   .select('sum(value)', 'sum')
    //   .where("type='outcome'")
    //   .getRawOne();

    const objOutcome = balance.find(q => q.type === 'outcome');
    const objIncome = balance.find(q => q.type === 'income');

    const income = Number(objIncome?.sum) || 0;
    const outcome = Number(objOutcome?.sum || 0);

    const sum = income - outcome;
    const total = Number(sum.toFixed(2));

    return {
      income,
      outcome,
      total,
    };
  }
}

export default TransactionsRepository;

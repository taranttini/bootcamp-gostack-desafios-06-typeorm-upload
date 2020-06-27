import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    // TODO
    const transactionType = type.toLocaleLowerCase();

    if (!['income', 'outcome'].includes(transactionType)) {
      throw new AppError(
        "Type invalid, only accepts 'income' or 'outcome'",
        400,
      );
    }

    const transactionRepository = getCustomRepository(TransactionsRepository);

    if (transactionType === 'outcome') {
      const balance = await transactionRepository.getBalance();

      if (balance.total === 0 || balance.total - value < 0) {
        throw new AppError(
          "Don't have sufficient funds for this operation.",
          400,
        );
      }
    }

    const categoryRepository = getRepository(Category);
    let categoryTransaction = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryTransaction) {
      categoryTransaction = categoryRepository.create({ title: category });
      await categoryRepository.save(categoryTransaction);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: categoryTransaction,
    });
    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;

import fs from 'fs';
import path from 'path';
import loadCSV from '../config/loadCSV';
import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  filename: string;
}

class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[]> {
    //Transaction
    // TODO
    const cvsFilePath = path.join(uploadConfig.directory, filename);
    const lines = await loadCSV(cvsFilePath);

    const newTransaction = new CreateTransactionService();

    const transactions: Transaction[] = [];
    for (let line of lines) {
      const [title, type, value, category] = line;
      const transaction = await newTransaction.execute({
        title,
        type,
        value,
        category,
      });
      transactions.push(transaction);
    }

    await fs.promises.unlink(cvsFilePath);
    return transactions;
  }
}

export default ImportTransactionsService;

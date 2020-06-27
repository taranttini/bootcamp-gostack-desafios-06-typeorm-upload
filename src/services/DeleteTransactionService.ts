import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

interface RequestDTO {
  transaction_id: string;
}

class DeleteTransactionService {
  public async execute({ transaction_id }: RequestDTO): Promise<void> {
    // TODO
    const transactioRepository = getRepository(Transaction);
    const transaction = await transactioRepository.find({
      where: { id: transaction_id },
    });

    if (!transaction || transaction.length === 0) {
      throw new AppError('Registro não localizado', 400);
    }
    await transactioRepository.remove(transaction);
  }
}

export default DeleteTransactionService;

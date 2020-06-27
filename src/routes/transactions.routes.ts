import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import uploadConfig from '../config/upload';
import TransactionsRepository from '../repositories/TransactionsRepository';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import CreateTransactionService from '../services/CreateTransactionService';
const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  // TODO
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find({
    relations: ['category'],
  });
  const balance = await transactionsRepository.getBalance();
  return response.status(200).json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  // TODO
  const createTransaction = new CreateTransactionService();
  const transaction = await createTransaction.execute(request.body);
  return response.status(200).json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
  const deleteTransaction = new DeleteTransactionService();
  await deleteTransaction.execute({ transaction_id: request.params.id });
  return response.sendStatus(204);
});

const uploadField = upload.single('file');
transactionsRouter.post('/import', uploadField, async (request, response) => {
  // TODO
  const importTransaction = new ImportTransactionsService();
  const transactions = await importTransaction.execute({
    filename: request.file.filename,
  });
  return response.status(200).json(transactions);
  /*
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    //const transactionsRepository = getRepository(TransactionRepository);
    const transactions = await transactionsRepository.find({
      relations: ['category'],
    });

    const balance = await transactionsRepository.getBalance();

    return response.status(200).json({
      transactions,
      balance,
    });
    */
});

export default transactionsRouter;

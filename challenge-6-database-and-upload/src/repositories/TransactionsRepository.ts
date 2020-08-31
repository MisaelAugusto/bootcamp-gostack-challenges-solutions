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
    const income = (await this.find({ type: 'income' })).reduce(
      (accum, transaction) => accum + Number(transaction.value),
      0,
    );

    const outcome = (await this.find({ type: 'outcome' })).reduce(
      (accum, transaction) => accum + Number(transaction.value),
      0,
    );

    const balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }
}

export default TransactionsRepository;

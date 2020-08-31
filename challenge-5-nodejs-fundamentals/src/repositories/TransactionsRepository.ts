import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const income = this.transactions
                     .filter(transaction => transaction.type === "income")
                     .reduce((sum, transaction) => sum + transaction.value, 0);
    const outcome = this.transactions
                      .filter(transaction => transaction.type === "outcome")
                      .reduce((sum, transaction) => sum + transaction.value, 0);

    const balance = {
      income,
      outcome,
      total: income - outcome
    };

    return balance;
  }

  public create({ title, value, type }: CreateTransaction): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;

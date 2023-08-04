const { faker } = require('@faker-js/faker');
const { workerData, parentPort } = require('worker_threads');

const { numTransactions, sellers, customers } = workerData;

const transactions = Array.from({ length: numTransactions }).map(() => {
  return {
    id: faker.string.uuid(),
    timestamp: faker.date.past({ years: 1 }).toLocaleDateString(),
    customerId: faker.helpers.arrayElement(customers.map(c => c.id)),
    customerAccountId: faker.helpers.arrayElement(customers.map(c => c.accountId)),

    // seller data
    sellerId: faker.helpers.arrayElement(sellers.map(s => s.id)),
    sellerAccountId: faker.helpers.arrayElement(sellers.map(s => s.accountId)),

    // transaction data
    amount: faker.number.float({ min: 1000, max: 100000 }),
    currencyCode: faker.finance.currencyCode(), // ISO 4217 currency code.
    paymentMethod: faker.helpers.arrayElement([
      "CREDIT_CARD",
      "DEBIT_CARD",
      "UPI",
      "BANK_TRANSFER"
    ])
  }
});

parentPort.postMessage(transactions);
const { Worker } = require('worker_threads');
const { faker } = require('@faker-js/faker');
const os = require('os');
const path = require('path');

const numTransactions = 1000000;
const numSellers = 1000;
const numCustomers = 10000;

const threads = os.cpus().length;

// Generate a set of 1000 unique sellers (or merchants)
const sellers = Array.from({ length: numSellers }).map(() => {
  return {
    id: faker.string.uuid(),
    accountId: faker.string.uuid()
  }
});

// Generate a set of 10,000 unique customers
const customers = Array.from({ length: numCustomers }).map(() => {
  return {
    id: faker.string.uuid(),
    accountId: faker.string.uuid()
  }
});

let transactions = [];



const startTime = Date.now();

const onMessage = (data) => {
  transactions = transactions.concat(data);
}

const onExit = () => {
  if (transactions.length === numTransactions) {
    const endTime = Date.now();
    console.log(`That took ${endTime - startTime}ms`);
  }
}

for (let i = 0; i < threads; i++) {
  const worker = new Worker(
    path.resolve(__dirname, 'random-data-generator.js'), {
      workerData: {
        numTransactions: numTransactions / threads,
        sellers,
        customers
      }
    }
  );

  worker.on('message', (data) => {
    transactions = transactions.concat(data);
  });
  worker.on('exit', () => {
    if (transactions.length === numTransactions) {
      const endTime = Date.now();
      console.log(`That took ${endTime - startTime}ms`);
    }
  })
}

// console.log(`That took ${endTime - startTime}ms`);


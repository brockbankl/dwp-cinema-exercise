// File: InteractiveTest.js
// Language: JavaScript

// This script allows the user to interactively test the TicketService class. 
// It prompts the user to enter an account ID and then asks for ticket types and quantities. 
// The script then uses the TicketService class to purchase the tickets and displays the result.

import readline from 'readline';
import TicketService from '../src/pairtest/TicketService.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function interactiveTest() {
  try {
    const accountId = await new Promise((resolve) => {
      rl.question('Enter account ID (must be a positive integer): ', (id) => {
        resolve(Number(id));
      });
    });

    const ticketService = new TicketService();
    ticketService._checkValidAccountId(accountId);

    const ticketTypeRequests = [];
    let continueAdding = true;

    while (continueAdding) {
      const ticketType = await new Promise((resolve) => {
        rl.question(`Enter ticket type (ADULT, CHILD, INFANT) or type 'DONE' to finish: `, (type) => {
          resolve(type);
        });
      });

      if (ticketType === 'DONE') {
        continueAdding = false;
        continue;
      }

      const ticketCount = await new Promise((resolve) => {
        rl.question(`Enter number of ${ticketType} tickets: `, (count) => {
          resolve(Number(count));
        });
      });

      ticketTypeRequests.push({
        getTicketType: () => ticketType,
        getNoOfTickets: () => ticketCount
      });
    }

    const result = ticketService.purchaseTickets(accountId, ...ticketTypeRequests);
    console.log(result.message);
    console.log(result.totalCost);
    console.log(result.seatsReserved);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    rl.close();
  }
}

interactiveTest();
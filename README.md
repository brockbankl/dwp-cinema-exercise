# cinema-tickets-javascript
DWP cinema ticket coding exercise. 

# Ticket Service System

The Ticket Service System is a solution for managing and purchasing tickets for various events. The system is built on Node.js and incorporates third-party services for payment and seat reservation functionalities. 

## Features:

- Support for multiple ticket types: ADULT, CHILD, and INFANT.
- Validation on ticket types, counts, and purchase requests.
- Integration with payment gateway for seamless transactions.
- Integration with seat reservation system to ensure seat availability.

## Validation/Tests Included:

1. Check for sufficient parameters before processing ticket requests.
2. Validate account IDs to ensure they're in the correct format and value.
3. Validate ticket types against supported types.
4. Ensure ticket counts are positive integers.
5. Check for logical ticketing issues, such as purchasing more infant tickets than adult ones.
6. Validate total number of tickets purchased at a time against a set limit.
7. Calculate total cost based on ticket type and counts.
8. Calculate the total number of seats required for the purchase.
9. Handle payment transactions and seat reservations.

## Prerequisites:

1. **Node.js & npm**: Before you can run this project, you need to have Node.js and npm (Node Package Manager) installed. If you don't have them, download and install [Node.js](https://nodejs.org/en/download/). npm is included with Node.js.

2. **Git**: Ensure Git is installed on your machine to clone the project repository. You can download Git from [here](https://git-scm.com/downloads).

## Setup Instructions:

1. **Clone the Repository**   
```git clone https://github.com/brockbankl/dwp-cinema-test.git```

2. **Navigate to the project directory:**  
```cd [project-directory]```

3. **Install Dependencies:*: 
In the command line, run:  
```npm install```

4. **Running the Application:**   
Once all dependencies are installed, you can run the application tests with:  
```npm test```  
This will also create a test-report.html in the root directory for better viewing.

5. **CLI based testing interface:**  
As part of this mock a simple interface has also been included to run tests.  
Run this by navigating in cmd to the project root and running:  
```node test/InteractiveTest.js```

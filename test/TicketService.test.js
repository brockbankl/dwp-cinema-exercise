// Importing necessary modules
import TicketService from '../src/pairtest/TicketService.js';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';
import TicketPaymentService from '../src/thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../src/thirdparty/seatbooking/SeatReservationService.js';

// Mocking external services
jest.mock('../src/thirdparty/paymentgateway/TicketPaymentService.js');
jest.mock('../src/thirdparty/seatbooking/SeatReservationService.js');

// Clear mocks before each test
beforeEach(() => {
    TicketPaymentService.mockClear();
    SeatReservationService.mockClear();
});

// Group of tests related to TicketService
describe('TicketService', () => {
    // Nested group for purchaseTickets method
    describe('PurchaseTickets', () => {
        let service;

        // Instantiate the service before each test
        beforeEach(() => {
            service = new TicketService();
        });

        // Test for insufficient arguments when purchasing tickets
        it('throws an error for insufficient arguments', () => {
            expect(() => service.purchaseTickets(new TicketTypeRequest('ADULT', 5)))
                .toThrow('Insufficient arguments');
        });

        // Test for validation when an undefined account ID is provided
        it('throws an error for undefined account ID', () => {
            expect(() => service.purchaseTickets(undefined, new TicketTypeRequest('ADULT', 5)))
                .toThrow('Invalid account id');
        });

        // Test for validation when an account ID less than 1 is provided
        it('throws an error for account ID less than 1', () => {
            expect(() => service.purchaseTickets(-1, new TicketTypeRequest('ADULT', 5)))
                .toThrow('Invalid account id');
        });

        // Test for validation when a non-numeric account ID is provided
        it('throws an error for non-numeric account ID', () => {
            expect(() => service.purchaseTickets('1', new TicketTypeRequest('ADULT', 5)))
                .toThrow('Invalid account id');
        });

        // Test for validation when more than the maximum allowed tickets are requested
        it('throws an error for more than 20 tickets requested', () => {
            expect(() => service.purchaseTickets(
                12345,
                new TicketTypeRequest('ADULT', 19),
                new TicketTypeRequest('CHILD', 5)
            )).toThrow('Only a maximum of 20 tickets that can be purchased at a time.');
        });

        // Test to ensure infants cannot be booked without accompanying adults
        it('throws an error for infant tickets without an adult ticket', () => {
            expect(() => service.purchaseTickets(12345, new TicketTypeRequest('INFANT', 5)))
                .toThrow('Child and Infant tickets cannot be purchased without purchasing an Adult ticket.');
        });

        // Test to ensure children cannot be booked without accompanying adults
        it('throws an error for child tickets without an adult ticket', () => {
            expect(() => service.purchaseTickets(12345, new TicketTypeRequest('CHILD', 5)))
                .toThrow('Child and Infant tickets cannot be purchased without purchasing an Adult ticket.');
        });

        // Test for validation when more infants than adults are booked
        it('throws an error for more infants than adults', () => {
            expect(() => service.purchaseTickets(
                12345,
                new TicketTypeRequest('ADULT', 1),
                new TicketTypeRequest('INFANT', 2)
            )).toThrow('You may not have more infants than adults.');
        });

        // Test to ensure the payment service is called with the correct parameters
        it('calls TicketPaymentService with correct parameters', () => {
            service.purchaseTickets(
                12345,
                new TicketTypeRequest('ADULT', 2),
                new TicketTypeRequest('CHILD', 3),
                new TicketTypeRequest('INFANT', 1)
            );
            const mockPaymentService = TicketPaymentService.mock.instances[0];
            const mockMakePayment = mockPaymentService.makePayment;
            expect(mockMakePayment).toHaveBeenCalledTimes(1);
            expect(mockMakePayment).toHaveBeenCalledWith(12345, 70);
        });

        // Test to ensure the reservation service is called with the correct parameters
        it('calls SeatReservationService with correct parameters', () => {
            service.purchaseTickets(
                12345,
                new TicketTypeRequest('ADULT', 2),
                new TicketTypeRequest('CHILD', 3),
                new TicketTypeRequest('INFANT', 1)
            );
            const mockReservationService = SeatReservationService.mock.instances[0];
            const mockReserveSeat = mockReservationService.reserveSeat;
            expect(mockReserveSeat).toHaveBeenCalledTimes(1);
            expect(mockReserveSeat).toHaveBeenCalledWith(12345, 5);
        });

        // Test to ensure no tickets can be purchased if zero are requested
        it('throws an error for zero total tickets', () => {
            expect(() => service.purchaseTickets(
                12345,
                new TicketTypeRequest('ADULT', 0),
                new TicketTypeRequest('CHILD', 0)
            )).toThrow('No tickets have been requested, this must be a positive integer.');
        });

        // Test for validation when a negative ticket count is provided
        it('throws an error for negative ticket counts', () => {
            expect(() => service.purchaseTickets(12345, new TicketTypeRequest('ADULT', -1)))
                .toThrow('Number of Tickets must be a positive integer');
        });

        // Test for validation when an invalid ticket type is provided
        it('throws an error for invalid ticket types', () => {
            expect(() => service.purchaseTickets(12345, new TicketTypeRequest('ELDERLY', 1)))
                .toThrow('type must be ADULT, CHILD, or INFANT');
        });

        // Test to ensure the system acknowledges a successful purchase
        it('acknowledges successful purchase', () => {
            const response = service.purchaseTickets(12345, new TicketTypeRequest('ADULT', 1));
            expect(response.message).toBe('Tickets purchased successfully');
            expect(response.totalCost).toBe('Total Cost: 20');
            expect(response.seatsReserved).toBe('Seats Reserved: 1');
        });
    });
});
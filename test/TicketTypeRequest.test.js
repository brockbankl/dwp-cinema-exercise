// Importing necessary module
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';

// Test for TicketTypeRequest class
describe('TicketTypeRequest', () => {
    it('is an immutable object', () => {
        const ticket = new TicketTypeRequest('ADULT', 1);
        expect(Object.isExtensible(ticket)).toEqual(false);
    });

    // Test for handling non-integer ticket counts
    it('throws an error for non-integer ticket counts', () => {
        expect(() => new TicketTypeRequest('ADULT', 'five'))
            .toThrow('noOfTickets must be a positive integer');
    });

    // Test to ensure ticket type property is read-only
    it('does not allow changes to ticket type after creation', () => {
        const ticket = new TicketTypeRequest('ADULT', 1);
        expect(() => { ticket.type = 'CHILD' }).toThrow(TypeError);
    });
});
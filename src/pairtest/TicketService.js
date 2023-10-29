// Importing necessary modules and exceptions
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

// Class definition for TicketService
export default class TicketService {

  // Initialising instances for payment and seat reservation services
  static #paymentServiceInstance = new TicketPaymentService();
  static #seatReservationServiceInstance = new SeatReservationService();

  // Private member variables for services
  #paymentService = TicketService.#paymentServiceInstance;
  #seatReservationService = TicketService.#seatReservationServiceInstance;

  // Supported ticket types
  #supportedTicketTypes = ['ADULT', 'CHILD', 'INFANT'];

  // Constructor to instantiate new service objects
  constructor() {
    this.#paymentService = new TicketPaymentService();
    this.#seatReservationService = new SeatReservationService();
  }

  /**
   * Checks for sufficient parameters.
   * @param {Array} ticketTypeRequests 
   * @private
   */
  _checkSufficientParameters(ticketTypeRequests) {
    if (ticketTypeRequests.length === 0) {
      throw new InvalidPurchaseException('Insufficient arguments.');
    }
  }

  /**
   * Validates account ID.
   * @param {number} accountId 
   * @private
   */
  _checkValidAccountId(accountId) {
    if (!Number.isInteger(accountId) || !accountId || accountId < 1) {
      throw new TypeError('Invalid account id.');
    }
  }

  /**
   * Validates ticket type.
   * @param {string} ticketType 
   * @private
   */
  _validateTicketRestrictions(ticketType) {
    if (!this.#supportedTicketTypes.includes(ticketType)) {
      throw new InvalidPurchaseException('Invalid ticket type.');
    }
  }

  /**
   * Validates ticket count.
   * @param {number} ticketCount 
   * @private
   */
  _validateTicketCount(ticketCount) {
    if (!Number.isInteger(ticketCount) || ticketCount < 0) {
      throw new InvalidPurchaseException('Number of Tickets must be a positive integer.');
    }
  }

  /**
   * Validates ticket categories.
   * @param {Object} ticketsPerCategory 
   * @private
   */
  _validateTickets(ticketsPerCategory) {
    if (ticketsPerCategory.ADULT < ticketsPerCategory.INFANT) {
      throw new InvalidPurchaseException('You may not have more infants than adults.');
    }
    const totalNumberOfTickets = Object.values(ticketsPerCategory).reduce(
      (previousValue, currentValue) => previousValue + currentValue
    );
    const maxAllowedTickets = 20;
    if (totalNumberOfTickets > maxAllowedTickets) {
      throw new InvalidPurchaseException(`Only a maximum of ${maxAllowedTickets} tickets that can be purchased at a time.`);
    }
    if (!ticketsPerCategory.hasOwnProperty('ADULT')) {
      throw new InvalidPurchaseException('Child and Infant tickets cannot be purchased without purchasing an Adult ticket.');
    }
  }

  /**
   * Groups and counts tickets by type.
   * @param {Array} ticketTypeRequests 
   * @returns {Object}
   * @private
   */
  _categoriseAndCountTickets(ticketTypeRequests) {
    const ticketsPerCategory = new Map();
    ticketTypeRequests.forEach((ticket) => {
      const ticketType = ticket.getTicketType();
      this._validateTicketRestrictions(ticketType);

      const count = ticket.getNoOfTickets();
      this._validateTicketCount(count);

      const currentCount = ticketsPerCategory.get(ticketType) || 0;
      ticketsPerCategory.set(ticketType, currentCount + count);
    });
    return Object.fromEntries(ticketsPerCategory);
  }

  /**
   * Gets a value or zero if not present.
   * @param {Object} ticketsPerCategory 
   * @param {string} category 
   * @returns {number}
   * @private
   */
  _getTicketCountOrZero(ticketsPerCategory, category) {
    return ticketsPerCategory[category] || 0;
  }

  /**
   * Calculates total ticket cost.
   * @param {Object} ticketsPerCategory 
   * @returns {number}
   * @private
   */
  _calculateTotalCostForTickets(ticketsPerCategory) {
    const ticketPrices = {
      INFANT: 0,
      CHILD: 10,
      ADULT: 20
    };

    const { INFANT, CHILD, ADULT } = ticketPrices;

    const totalAdultTicketPrice = ADULT * this._getTicketCountOrZero(ticketsPerCategory, 'ADULT');
    const totalChildPrice = CHILD * this._getTicketCountOrZero(ticketsPerCategory, 'CHILD');
    const totalInfantPrice = INFANT * this._getTicketCountOrZero(ticketsPerCategory, 'INFANT');

    return totalAdultTicketPrice + totalChildPrice + totalInfantPrice;
  }

  /**
   * Calculates the total number of seats required.
   * @param {Object} ticketsPerCategory 
   * @returns {number}
   * @private
   */
  _calculateTotalSeatsRequired(ticketsPerCategory) {
    const totalSeatsToReserve = this._getTicketCountOrZero(ticketsPerCategory, 'ADULT') + this._getTicketCountOrZero(ticketsPerCategory, 'CHILD');
    if (totalSeatsToReserve === 0) {
      throw new InvalidPurchaseException('No tickets have been requested, this must be a positive integer.');
    }
    return totalSeatsToReserve;
  }

  /**
   * Purchases tickets.
   * @param {number} accountId 
   * @param {Object[]} ticketTypeRequests 
   * @returns {Object}
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {
    this._checkSufficientParameters(ticketTypeRequests);
    this._checkValidAccountId(accountId);
  
    const ticketsPerCategory = this._categoriseAndCountTickets(ticketTypeRequests);
    this._validateTickets(ticketsPerCategory);
  
    const totalTicketPrice = this._calculateTotalCostForTickets(ticketsPerCategory);
    this.#paymentService.makePayment(accountId, totalTicketPrice);
  
    const totalSeatsToReserve = this._calculateTotalSeatsRequired(ticketsPerCategory);
    this.#seatReservationService.reserveSeat(accountId, totalSeatsToReserve);
  
    // Return a success message for the purchase, the total ticket price, and the number of reserved seats
    return {
      message: 'Tickets purchased successfully',
      totalCost: `Total Cost: ${totalTicketPrice}`,
      seatsReserved: `Seats Reserved: ${totalSeatsToReserve}`
    };
  }
  
}



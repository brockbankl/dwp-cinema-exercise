/**
 * Immutable Object.
 */

export default class TicketTypeRequest {
  #type;
  #noOfTickets;
  #Type = ['ADULT', 'CHILD', 'INFANT'];

  constructor(type, noOfTickets) {
    if (!this.#Type.includes(type)) {
      throw new TypeError(`type must be ${this.#Type.slice(0, -1).join(', ')}, or ${this.#Type.slice(-1)}`);
    }

    if (!Number.isInteger(noOfTickets)) {
      throw new TypeError('noOfTickets must be a positive integer');
    }

    this.#type = type;
    this.#noOfTickets = noOfTickets;

    // Freeze the instance to prevent modification - true immutability 
    Object.freeze(this);
  }

  getNoOfTickets() {
    return this.#noOfTickets;
  }

  getTicketType() {
    return this.#type;
  }
}

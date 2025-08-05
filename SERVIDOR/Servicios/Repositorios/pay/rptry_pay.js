export default class TicketRepository {
  constructor(dao) {
      this.dao = dao;
  }

  getAll = (id, status) => {
      return this.dao.getAll(id, status);
  }

  save = (ticketData) => {
      return this.dao.save(ticketData);
  }

  updateStatus = (id) => {
      return this.dao.updateStatus(id);
  }
}

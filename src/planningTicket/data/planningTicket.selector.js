export const getFilteredworkorderList = store =>
  store.planningTicket.filteredWorkorderList;
export const getAppliedStatusFilter = store =>
  store.planningTicket.statusFilter;
export const getCountByStatus = store => store.planningTicket.countByStatus;

export const getSelectedPlanningTicket = store =>
  store.planningTicket.selectedTicketId;

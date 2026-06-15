export function selectLocationsState(state) {
  return state.locations;
}

export function selectLocationsStatus(state) {
  return state.locations.status;
}

export function selectLocationsError(state) {
  return state.locations.error;
}

export function selectLocationsList(state) {
  return state.locations.locations;
}

export function selectLocationsPagination(state) {
  return state.locations.pagination;
}

export function selectLocationsLoadingMore(state) {
  return state.locations.loadingMore;
}

export function selectLocationsLoadMoreError(state) {
  return state.locations.loadMoreError;
}

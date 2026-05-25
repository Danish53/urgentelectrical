/** @param {import('@/store').RootState} state */
export const selectServicesState = (state) => state.services;

export const selectBookableServices = (state) => state.services.bookable;
export const selectBookingOptions = (state) => state.services.bookingOptions;
export const selectFeaturedFromApi = (state) => state.services.featured;
export const selectServicesStatus = (state) => state.services.status;
export const selectServicesError = (state) => state.services.error;
export const selectServicesSource = (state) => state.services.source;

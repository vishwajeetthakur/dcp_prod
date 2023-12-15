// https://redux-toolkit.js.org/
// Packages
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';

// Utilities
// import { designPortalApiSlice } from '../components/pages/ManagedServices/utilities/api';
import slices, { actions } from './slices';

const store = configureStore({
  reducer: {
    globalStates: slices.reducer,
    // [designPortalApiSlice.reducerPath]: designPortalApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),//.concat(designPortalApiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
  enhancers: [
  ],
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export { store, actions };
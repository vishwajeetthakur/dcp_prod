import {
  createContext, useCallback, useEffect, useState,
} from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

// Utils
import { actions } from '../common/alerts';

const initialState = {
  lldQueue: [],
  relatedSites: [],
  currentCustomer: [],
  queuesAreLoading: true,
  isFetching: false,
  selections: {
    cid: null,
    site: null,
    product: null,
    device: null,
  },
};

const designPortalContext = createContext();

export const useDesignPortal = () => {
  // const { data: eneLldQueue, isLoading: eneQueueIsLoading } =
  // useQuery('ene_lld_queue', () =>
  // axios.get(paths.RUN_PYTHON + 'sf_get_ene_lld_queue.py'))
  // const { data: mneLldQueue, isLoading: mneQueueIsLoading } =
  // useQuery('mne_lld_queue', () =>
  // axios.get(paths.RUN_PYTHON + 'sf_get_mne_lld_queue.py'))
  const dispatch = useDispatch();

  const [state, setState] = useState(initialState);

  // const queuesAreLoading = (eneQueueIsLoading || mneQueueIsLoading) ?
  // true : false

  const setCurrentCustomer = (customer) => setState((prev) => ({ ...prev, currentCustomer: customer }));

  const setRelatedSites = (site) => (
    setState((prev) => ({
      ...prev,
      relatedSites: state.lldQueue.filter(({ customer }) => (customer === site.customer)),
    })));

  const setSelections = (selections) => setState((prev) => (
    { ...prev, selections: { ...prev.selections, ...selections } }));

  const clearSelections = () => setState((prev) => ({
    ...prev,
    relatedSites: [],
    currentCustomer: [],
    selections: {
      cid: null,
      site: null,
      product: null,
      device: null,
    },
  }));

  const makeRequest = useCallback(async (queryString) => {
    try {
      setState((prevState) => ({ ...prevState, isFetching: true }));

      dispatch(actions.createAlert({
        message: 'Loading...',
        type: 'info',
      }));

      const customer = (await axios.get(`/api/managed_services/getCustomerDetails${queryString}`)).data;

      setState((prev) => ({
        ...prev,
        currentCustomer: customer,
        selections: {
          ...prev.selections,
          cid: customer[0].cid,
          site: customer[0].address,
          product: customer[0].product,
        },
      }));

      designPortalContext.Provider.value = state;

      // Set the related sites so we have access to them throughout the Design Portal
      setRelatedSites(customer[0].customer);

      dispatch(actions.createAlert({
        message: 'Success!',
        type: 'success',
      }));
    } catch (error) {
      console.error(error);

      dispatch(actions.createAlert({
        message: error.message,
        type: 'error',
      }));
    } finally {
      setState((prevState) => ({ ...prevState, isFetching: false }));
    }
  }, []);

  // useEffect(() => {
  //     if (!queuesAreLoading) setState(prev =>
  // ({ ...prev, lldQueue: [...eneLldQueue.data, ...mneLldQueue.data] }))

  // console.log('Design Portal Context: ',
  // { eneLldQueue, mneLldQueue, eneQueueIsLoading, queuesAreLoading })
  // }, [queuesAreLoading])

  useEffect(() => {
    (async () => {
      const lldQueue = (await axios.get('/api/managed_services/getAvailableCustomers')).data;
      setState((prev) => ({ ...prev, lldQueue, queuesAreLoading: false }));
    })();
  }, []);

  return {
    ...state,
    queuesAreLoading: false,
    clearSelections,
    setCurrentCustomer,
    setRelatedSites,
    setSelections,
    makeRequest,
  };
};

export function DesignPortalProvider({ children }) {
  return (
    <designPortalContext.Provider value={designPortalContext.Provider.value}>
      {children}
    </designPortalContext.Provider>
  );
}
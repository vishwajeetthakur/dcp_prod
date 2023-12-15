// Packages
import {
  createContext, useCallback, useEffect, useState,
} from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

// Utils
import { actions } from '../common/alerts';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchContext = createContext();

export const useFetch = (initialUrl) => {
  // ==============================================
  // Hooks
  // ==============================================
  const dispatch = useDispatch();

  // =============================================
  // State/Refs
  // =============================================
  const [state, setState] = useState(initialState);

  // =============================================
  // Interaction Handlers
  // =============================================
  const makeRequest = useCallback(async (options) => {
    if (options) {
      try {
        setState((prevState) => ({ ...prevState, loading: true }));

        dispatch(actions.createAlert({
          message: 'Loading...',
          type: 'info',
        }));

        const { data } = await axios({
          url: options.url,
          method: options.method || 'GET',
          data: options.requestData,
        });

        setState((prevState) => ({ ...prevState, data }));

        fetchContext.Provider.value = data;

        dispatch(actions.createAlert({
          message: 'Success!',
          type: 'success',
        }));
      } catch (error) {
        console.error(error);

        setState((prevState) => ({ ...prevState, error }));

        dispatch(actions.createAlert({
          message: error.message,
          type: 'error',
        }));
      } finally {
        setState((prevState) => ({ ...prevState, loading: false }));
      }
    } else {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: 'Error: No Request options given.',
      }));
    }
  }, []);

  const resetFetchState = () => {
    // fetchContext.Provider.value = initialState
    setState(initialState);
  };

  useEffect(() => {
    (async () => {
      if (initialUrl) makeRequest({ url: initialUrl, method: 'GET' });
    })();
  }, [initialUrl]);

  // =============================================
  // Return
  // =============================================
  return {
    state,
    makeRequest,
    resetFetchState,
  };
};

export function FetchProvider({ children }) {
  return (
    <fetchContext.Provider value={fetchContext.Provider.value}>
      {children}
    </fetchContext.Provider>
  );
}
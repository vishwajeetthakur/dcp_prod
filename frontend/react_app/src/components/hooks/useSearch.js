// Packages
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Config
import { routes } from '../common/Routes/routesConfig';

// constants
import DESGN_PORTAL from '../../constants/designProtal';

export const useSearch = () => {
  // Hooks
  const location = useLocation();
  // Helpers
  const searchStringInArray = (str, strArray) => strArray.filter((item) => item && item.toLowerCase().match(str));

  const getSearchItem = (items) => {
    const searchedItem = searchStringInArray(items.toLowerCase().trim(), routes.map(({ name }) => name));

    return searchedItem.map((item) => routes.filter(({ name }) => item === name)[0]);
  };

  // Effects
  useEffect(() => {
    const history = JSON.parse(sessionStorage.getItem('history'));

    if (history == undefined || history.length == 0) sessionStorage.setItem('history', JSON.stringify([]));
  }, []);

  useEffect(() => {
    const history = JSON.parse(sessionStorage.getItem('history'));
    history.unshift(location.pathname);
    sessionStorage.setItem('history', JSON.stringify([...new Set(history)]));
  }, [location]);

  // Return
  return {
    getSearchItem,
    history: JSON
      .parse(sessionStorage
        .getItem('history'))
      ?.map((item) => routes.filter((route) => item === `/${route.path}`)[0]
                || DESGN_PORTAL.filter((route) => item === `/${route.path}`)[0]),
  };
};
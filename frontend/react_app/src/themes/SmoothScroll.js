import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export const navToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

export default function SmoothScroll({ children }) {
  const location = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (navType !== 'POP') navToTop();
  }, [location]);

  return children;
}
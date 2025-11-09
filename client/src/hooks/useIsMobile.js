import { useState, useEffect } from 'react';

const useIsMobile = (query = '(max-width: 767px)') => {
  const [isMobile, setIsMobile] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event) => setIsMobile(event.matches);

    // The 'change' event is more efficient than 'resize'
    mediaQuery.addEventListener('change', handler);

    // Cleanup listener on component unmount
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return isMobile;
};

export default useIsMobile;

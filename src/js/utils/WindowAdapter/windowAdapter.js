import { useEffect, useState } from 'react';
import { navigate } from 'gatsby';

export default function WindowAdapter({ children }) {
  const [location, setLocation] = useState(window.location);

  useEffect(() => {
    const handler = () => {
      setLocation(window.location);
    };

    window.addEventListener('popstate', handler);
    return () => {
      window.removeEventListener('popstate', handler);
    };
  }, []);

  const updateUrl = (search, replace) => {
    const newUrl = search
      ? `${search.startsWith('?') ? search : '?' + search}`
      : '';

    if (replace) {
      navigate(newUrl, { replace: true });
    } else {
      navigate(newUrl);
    }
  };

  const push = ({ search }) => updateUrl(search, false);
  const replace = ({ search }) => updateUrl(search, true);

  return children({
    location,
    push,
    replace
  });
}
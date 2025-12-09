import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ThemeHandler = () => {
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const theme = userInfo?.theme || localStorage.getItem('theme') || 'light';
    // set body class to either theme-light or theme-dark
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
    // also persist in localStorage as fallback
    localStorage.setItem('theme', theme);
  }, [userInfo]);

  return null;
};

export default ThemeHandler;

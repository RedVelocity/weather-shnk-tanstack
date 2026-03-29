// import { useEffect } from 'react';
// import { useAtom } from 'jotai';

import type { Theme } from '@/lib/types/location';

// import { themeAtom } from '@/lib/store';
const getTheme = (temp: number): Theme => {
  // const [theme, setTheme] = useAtom(themeAtom);

  // useEffect(() => {
  //   if (temp <= 15) setTheme('cool');
  //   else if (temp <= 27) setTheme('mild');
  //   else setTheme('hot');
  // }, [temp]); // Include other relevant dependencies if needed
  // return { theme };
  if (temp <= 15) return 'cool';
  if (temp <= 27) return 'mild';
  return 'hot';
};

export default getTheme;

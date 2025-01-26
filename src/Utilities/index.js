import { useMediaQuery } from '@mui/material';

export default function WindowWidth() {
  // MUI's breakpoints (xs, sm, md, lg, xl) are used for responsiveness
  const isXs = useMediaQuery('(max-width:576px)');
  const isSm = useMediaQuery('(min-width:577px) and (max-width:992px)');
  const isMd = useMediaQuery('(min-width:993px) and (max-width:1200px)');
  const isLg = useMediaQuery('(min-width:1201px)');


  let screenSize = 'xs'; // Default to extra small

  if (isXs || isSm) {
    screenSize = 'sm';
  } else if (isMd) {
    screenSize = 'md';
  } else if (isLg) {
    screenSize = 'lg';
  }

  return screenSize;
}

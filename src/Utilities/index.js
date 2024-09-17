import  { useEffect, useState } from 'react'

export default function WindowWidth() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        // Update the window width whenever the window is resized
        const handleResize = () => {
          setWindowWidth(window.innerWidth);
        };
    
        window.addEventListener('resize', handleResize);
    
        // Clean up the event listener when the component unmounts
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);


      

  let screenSize = 'xs'; // Default to extra small

  if (windowWidth <= 576) {
    screenSize = 'sm';
  }else if (windowWidth >= 577 && windowWidth <= 992) {
    screenSize = 'md';
  }else if (windowWidth >= 993) {
    screenSize = 'lg';
  }

  return screenSize
}


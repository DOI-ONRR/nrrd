import { useEffect, useState } from 'react'
// Hook
const  useOnScreen = (ref, rootMargin = '0px') => {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState(false);
    console.debug("ref ---- ", ref)
    console.debug("isIntersecting", isIntersecting, rootMargin)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
          // Update our state when observer callback fires
	  console.debug("what the hell is ", entry)
        setIntersecting(entry.isIntersecting);
      },
      {
        rootMargin
      }
    );
    if (ref.current) {
	observer.observe(ref.current);
	console.debug("ref ", ref.current)
    }
    return () => {
      observer.unobserve(ref.current);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return isIntersecting;
}

export default useOnScreen 

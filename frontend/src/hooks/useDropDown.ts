import { useState, useEffect, useRef } from 'react';

export const useDropDown = () => {
  const dropDownRef = useRef<HTMLDivElement>(null);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as HTMLDivElement)
      ) {
        setToggle(false);
      }
    }

    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  });
  return { dropDownRef, toggle, setToggle };
};

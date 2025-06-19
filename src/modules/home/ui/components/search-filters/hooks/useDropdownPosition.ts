import { RefObject } from "react";

const useDropdownPosition = (
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>
) => {
  // define where the dropdown will be
  const getDropdownPosition = () => {
    if (!ref.current) return { top: 0, left: 0 };
    const rect = ref.current.getBoundingClientRect();
    const dropdownWidth = 240; // w-60 = 15rem = 240px
    let left = rect.left + window.scrollX;
    const top = rect.bottom + window.scrollY;
    // does the dropdown go off the right edge of the viewport?
    if (left + dropdownWidth > window.innerWidth) {
      // align to right edge of the button instead
      left = rect.right + window.scrollX - dropdownWidth;
      // is the dropdown still off-screen?
      if (left < 0) {
        // align to the right edge of the viewport with some padding
        left = window.innerWidth - dropdownWidth - 16;
      }
    }
    // ensure dropdown does not go off left edge
    if (left < 0) {
      left = 16;
    }
    return { top, left };
  };
  return {
    getDropdownPosition,
  };
};

export default useDropdownPosition;

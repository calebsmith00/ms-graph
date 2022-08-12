import { useEffect } from "react";

interface OutsideClickProps {
  callback: EventListenerOrEventListenerObject;
}

export default function useOutsideClick(props: OutsideClickProps) {
  const { callback } = props;

  useEffect(() => {
    document.addEventListener("click", callback, true);

    return () => {
      document.removeEventListener("click", callback, true);
    };
  }, []);

  return null;
}

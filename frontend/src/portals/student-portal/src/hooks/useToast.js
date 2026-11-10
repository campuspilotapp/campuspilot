import { useState, useRef, useCallback } from 'react';

export default function useToast(duration = 2400) {
  const [message, setMessage] = useState('');
  const timer = useRef();
  const show = useCallback((text) => {
    setMessage(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(''), duration);
  }, [duration]);
  return { message, show };
}

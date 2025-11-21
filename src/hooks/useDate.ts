import { useState, ChangeEvent } from 'react';

export default function useDate() {
  const [date, setDate] = useState('');

  const handleDate = (e: ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  return { date, handleDate };
}

'use client';

import Input from '../common/Input';
import useDate from '@/hooks/useDate';

export default function DateInput() {
  const { date, handleDate } = useDate();
  return (
    <>
      <Input type="date" label="시작일" value={date} onChange={handleDate} />
    </>
  );
}

'use client';

import Input from '../common/Input';
import useHourlyPay from '@/hooks/useHourlyPay';

export default function HourlyPayInput() {
  const { pay, payError, payErrorMessage, handleHourlyPayChange, handleHourlyPayBlur } =
    useHourlyPay();
  return (
    <>
      <Input
        type="number"
        label="시급*"
        value={pay}
        onChange={handleHourlyPayChange}
        onBlur={handleHourlyPayBlur}
        error={payError}
        errorMessage={payErrorMessage}
        showUnit={true}
      />
    </>
  );
}

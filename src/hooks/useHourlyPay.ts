import { ChangeEvent, FocusEvent, useState } from 'react';

export default function useHourlyPay() {
  const [pay, setPay] = useState('');
  const [payError, setPayError] = useState(false);
  const [payErrorMessage, setPayErrorMessage] = useState('');

  const handleHourlyPayChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPay(e.target.value);
  };
  const handleHourlyPayBlur = (e: FocusEvent<HTMLInputElement>) => {
    const nowYear = new Date().getFullYear();
    const lowerLimit = 10320;
    const value = e.target.value;
    if (value && Number(value) < lowerLimit) {
      setPayError(true);
      setPayErrorMessage(
        `${nowYear}년 최소 시급은 ${lowerLimit.toLocaleString('ko-KR')}원 입니다.`,
      );
    } else {
      setPayError(false);
      setPayErrorMessage('');
    }
  };

  return { pay, payError, payErrorMessage, handleHourlyPayChange, handleHourlyPayBlur };
}

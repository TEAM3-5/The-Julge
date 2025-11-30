// 숫자만 남기기
export function extractDigits(value: string) {
  return value.replace(/[^0-9]/g, '').slice(0, 11);
}

// 02 / 010 / 지역번호 자동 포맷
export function formatPhoneNumber(digits: string) {
  const v = digits.slice(0, 11);

  if (v.startsWith('02')) {
    if (v.length <= 2) return v;
    if (v.length <= 5) return v.replace(/(\d{2})(\d{1,3})/, '$1-$2');
    if (v.length <= 9) return v.replace(/(\d{2})(\d{3})(\d{1,4})/, '$1-$2-$3');
    return v.replace(/(\d{2})(\d{4})(\d{1,4})/, '$1-$2-$3');
  }

  if (v.length <= 3) return v;
  if (v.length <= 7) return v.replace(/(\d{3})(\d{1,4})/, '$1-$2');

  return v.replace(/(\d{3})(\d{3,4})(\d{1,4})/, '$1-$2-$3');
}

// 최종 유효성 검사 (schema에서도 사용)
export function isValidPhone(digits: string) {
  if (!/^[0-9]+$/.test(digits)) return false;

  if (digits.startsWith('02')) {
    return digits.length === 9 || digits.length === 10;
  }

  return digits.length === 10 || digits.length === 11;
}

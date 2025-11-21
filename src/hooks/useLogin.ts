import { ChangeEvent, useState, FocusEvent } from 'react';

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function isValidEmail(email: string) {
  return EMAIL_PATTERN.test(email);
}

export default function useLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(false);
    setEmailErrorMessage('');
  };
  const handleEmailBlur = (e: FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && !isValidEmail(value)) {
      setEmailError(true);
      setEmailErrorMessage('이메일 형식으로 작성해 주세요.');
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }
  };
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(false);
    setPasswordErrorMessage('');
  };
  const handlePasswordBlur = (e: FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && value.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage('8자 이상 입력해 주세요.');
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }
  };

  return {
    email,
    emailError,
    emailErrorMessage,
    password,
    passwordError,
    passwordErrorMessage,
    handleEmailChange,
    handleEmailBlur,
    handlePasswordChange,
    handlePasswordBlur,
  };
}

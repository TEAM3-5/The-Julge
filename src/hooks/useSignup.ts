import { ChangeEvent, useState, FocusEvent } from 'react';

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function isValidEmail(email: string) {
  return EMAIL_PATTERN.test(email);
}

export default function useSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordCheckError, setPasswordCheckError] = useState(false);
  const [passwordCheckErrorMessage, setPasswordCheckErrorMessage] = useState('');

  // Email 관련 로직
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
  // Password 관련 로직
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
  // Password Check 관련 로직
  const handlePasswordCheckChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordCheck(e.target.value);
    setPasswordCheckError(false);
    setPasswordCheckErrorMessage('');
  };
  const handlePasswordCheckBlur = (e: FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && password !== value) {
      setPasswordCheckError(true);
      setPasswordCheckErrorMessage('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordCheckError(false);
      setPasswordCheckErrorMessage('');
    }
  };

  return {
    email,
    emailError,
    emailErrorMessage,
    password,
    passwordError,
    passwordErrorMessage,
    passwordCheck,
    passwordCheckError,
    passwordCheckErrorMessage,
    handleEmailChange,
    handleEmailBlur,
    handlePasswordChange,
    handlePasswordBlur,
    handlePasswordCheckChange,
    handlePasswordCheckBlur,
  };
}

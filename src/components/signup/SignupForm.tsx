'use client';

import Input from '../common/Input';
import useSignup from '@/hooks/useSignup';

export default function SignupForm() {
  const {
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
  } = useSignup();

  return (
    <div>
      <Input
        type="email"
        label="이메일"
        value={email}
        onChange={handleEmailChange}
        onBlur={handleEmailBlur}
        error={emailError}
        errorMessage={emailErrorMessage}
      />
      <Input
        type="password"
        label="비밀번호"
        value={password}
        onChange={handlePasswordChange}
        onBlur={handlePasswordBlur}
        error={passwordError}
        errorMessage={passwordErrorMessage}
      />
      <Input
        type="password"
        label="비밀번호 확인"
        value={passwordCheck}
        onChange={handlePasswordCheckChange}
        onBlur={handlePasswordCheckBlur}
        error={passwordCheckError}
        errorMessage={passwordCheckErrorMessage}
      />
    </div>
  );
}

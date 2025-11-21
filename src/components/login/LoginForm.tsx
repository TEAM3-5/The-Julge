'use client';

import Input from '../common/Input';
import useLogin from '@/hooks/useLogin';

export default function LoginForm() {
  const {
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
  } = useLogin();

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
    </div>
  );
}

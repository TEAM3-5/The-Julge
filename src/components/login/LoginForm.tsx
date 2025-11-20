'use client';

import { useState } from 'react';
import Input from '../common/Input';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  return (
    <div>
      <Input
        type="email"
        label="이메일"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setEmailError(false);
        }}
        onBlur={(e) =>
          e.target.value && !isValidEmail(e.target.value)
            ? setEmailError(true)
            : setEmailError(false)
        }
        error={emailError}
        errorMessage="잘못된 이메일입니다."
      />
    </div>
  );
}

function isValidEmail(email: string) {
  const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return EMAIL_PATTERN.test(email);
}

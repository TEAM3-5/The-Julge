import Button from '@/components/common/Button';
import DateInput from '@/components/date/DateInput';
import HourlyPayInput from '@/components/hourlypay/HourlyPayInput';
import LoginForm from '@/components/login/LoginForm';
import SignupForm from '@/components/signup/SignupForm';

export default function Home() {
  return (
    <>
      <Button>로그인 하기</Button>
      <Button variant="outline" disabled>
        로그인 하기
      </Button>
      <Button disabled>신청 불가</Button>
      <Button variant="outline" size="medium">
        로그인 하기
      </Button>

      <Button size="medium" variant="outline" btnColor="blue">
        로그인 하기
      </Button>
      <Button size="medium" disabled>
        신청 불가
      </Button>

      <Button size="small" className="w-25">
        예
      </Button>
      <Button variant="outline" size="small" className="w-25">
        아니오
      </Button>

      <LoginForm />
      <SignupForm />
      <HourlyPayInput />
      <DateInput />
    </>
  );
}

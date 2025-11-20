import Button from '@/components/common/Button';
import LoginForm from '@/components/login/LoginForm';

export default function Home() {
  return (
    <>
      <Button>로그인 하기</Button>
      <Button variant="outline">로그인 하기</Button>
      <Button disabled>신청 불가</Button>
      <Button variant="outline" size="medium">
        로그인 하기
      </Button>
      <Button size="medium">로그인 하기</Button>
      <Button size="medium" disabled>
        신청 불가
      </Button>
      <Button size="small">로그인 하기</Button>
      <Button variant="outline" size="small">
        로그인 하기
      </Button>
      <LoginForm />
    </>
  );
}

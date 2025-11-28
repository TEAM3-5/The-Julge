import Button from '@/components/e/Button';

export default function NotFound() {
  return (
    <div className="flex flex-1 min-h-full flex-col items-center justify-center gap-4 px-6 py-12 text-center">
      <div className="tj-h1 font-bold text-primary">404</div>
      <p className="text-gray-60">요청하신 페이지를 찾을 수 없습니다.</p>
      <Button href="/" size="medium">
        홈으로 이동
      </Button>
    </div>
  );
}

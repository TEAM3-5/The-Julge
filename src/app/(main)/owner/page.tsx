import Button from '@/components/common/Button';
import Link from 'next/link';

export default function OwnerDashboardPage() {
  return (
    <div className="flex justify-center">
      사장님(Owner) 페이지입니다.
      <Link href="/owner/postings/new">
        <Button>공고 등록하기</Button>
      </Link>
    </div>
  );
}

'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, type KeyboardEvent, type ChangeEvent } from 'react';

export type UserRole = 'OWNER' | 'MEMBER' | 'GUEST';

interface NavBarProps {
  isLoggedIn: boolean;
  role: UserRole;
}

export default function NavBar({ isLoggedIn, role }: NavBarProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [alertCount, setAlertCount] = useState(0);

  const handleMainPage = () => {
    router.push('/');
  };

  const handleMyPage = () => {
    if (!isLoggedIn) return router.push('/login');
    if (role === 'MEMBER') router.push('/member/profile');
    else router.push('/owner/store');
  };

  const handleLogout = () => {
    // TODO: 로그아웃 로직 + 공고 리스트 페이지 이동
    router.push('/posts');
  };

  const handleAlarm = () => {
    // TODO: 알림 모달 열기
  };

  const handleSearch = (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    router.push(`/posts?search=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(keyword);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  switch (role) {
    case 'OWNER':
      break;
    case 'MEMBER':
      break;
    case 'GUEST':
      break;
    default:
      throw new Error('Invalid user role');
  }
  const firstLabel = !isLoggedIn ? '로그인' : role === 'OWNER' ? '내 가게' : '내 프로필';
  const secondLabel = isLoggedIn ? '로그아웃' : '회원가입';

  return (
    <div className="flex justify-between items-center w-full pl-52 pr-52">
      <div className="flex items-center gap-10">
        <Image
          src="/images/logo.svg"
          alt="로고"
          width={109}
          height={20}
          className="cursor-pointer"
          onClick={handleMainPage}
        />
        <div className="flex gap-2.5 bg-gray-10 rounded-[10px] mt-[15px] mb-[15px] p-2.5 w-[450px]">
          <Image
            src="/images/search.svg"
            alt="검색 돋보기"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={() => handleSearch(keyword)}
          />
          <input
            placeholder="가게 이름으로 찾아보세요"
            className="focus:outline-none w-full"
            value={keyword}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      <div className="flex items-center gap-10">
        <button
          type="button"
          className="cursor-pointer select-none tj-body1-bold"
          onClick={handleMyPage}
        >
          {firstLabel}
        </button>
        <button
          type="button"
          className="cursor-pointer select-none tj-body1-bold"
          onClick={handleLogout}
        >
          {secondLabel}
        </button>
        {isLoggedIn && (
          <Image
            src={
              alertCount > 0
                ? '/images/notification(active).svg'
                : '/images/notification(inactive).svg'
            }
            alt="알림 열람 아이콘"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={handleAlarm}
          />
        )}
      </div>
    </div>
  );
}

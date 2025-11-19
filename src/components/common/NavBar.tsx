'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, type KeyboardEvent, type ChangeEvent } from 'react';

type UserRole = 'OWNER' | 'WORKER' | null;

interface NavBarProps {
  isLoggedIn: boolean;
  role: UserRole;
}

export default function NavBar({ isLoggedIn, role }: NavBarProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');

  const handleMainPage = () => {
    router.push('/');
  };

  const handleMyPage = () => {
    if (!isLoggedIn) return router.push('/login');
    if (role === 'WORKER') router.push('/worker/profile');
    else router.push('/owner/my-store');
  };

  const handleLogout = () => {
    // TODO: 로그아웃 로직 + 이동
  };

  const handleAlarm = () => {
    // TODO: 알림 모달 열기
  };

  const handleSearch = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    router.push(`/jobs?search=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(keyword);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const myLabel = !isLoggedIn ? '로그인' : role === 'OWNER' ? '내 가게' : '내 프로필';
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
        <button type="button" className="cursor-pointer select-none" onClick={handleMyPage}>
          {myLabel}
        </button>
        <button type="button" className="cursor-pointer select-none" onClick={handleLogout}>
          {secondLabel}
        </button>
        {isLoggedIn && (
          <Image
            src="/images/notification.svg"
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

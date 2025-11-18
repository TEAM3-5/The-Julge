'use client';

import Image from 'next/image';
import { useState, type KeyboardEvent, type ChangeEvent } from 'react';

type UserRole = 'OWNER' | 'WORKER' | null;

interface NavBarProps {
  isLoggedIn: boolean;
  role: UserRole; // 'OWNER' | 'WORKER' | null = 'WORKER'
  onClickMainPage: () => void;
  onClickMyPage: () => void;
  onClickLogout: () => void;
  onClickAlarm: () => void;
  onSearch: (keyword: string) => void;
}

export default function NavBar({
  isLoggedIn,
  role,
  onClickMainPage,
  onClickMyPage,
  onClickLogout,
  onClickAlarm,
  onSearch,
}: NavBarProps) {
  const [keyword, setKeyword] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = keyword.trim();
      if (!trimmed) return;
      onSearch(trimmed); // 부모에게 검색어 전달
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
          onClick={onClickMainPage}
        />
        <div className="flex gap-2.5 bg-gray-10 rounded-[10px] mt-[15px] mb-[15px] p-2.5 w-[450px]">
          <Image
            src="/images/search.svg"
            alt="검색 돋보기"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={() => {
              const trimmed = keyword.trim();
              if (!trimmed) return;
              onSearch(trimmed);
            }}
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
        <button type="button" className="cursor-pointer select-none" onClick={onClickMyPage}>
          {myLabel}
        </button>
        <button type="button" className="cursor-pointer select-none" onClick={onClickLogout}>
          {secondLabel}
        </button>
        {isLoggedIn && (
          <Image
            src="/images/notification.svg"
            alt="알림 열람 아이콘"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={onClickAlarm}
          />
        )}
      </div>
    </div>
  );
}

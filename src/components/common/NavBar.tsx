'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, type KeyboardEvent, type ChangeEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { USER_ROLE } from '@/constants/auth';

export default function NavBar() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');

  const { isLoggedIn, role: authRole, clearAuth } = useAuth();

  const role = authRole;

  // 알림 개수 (나중에 API 붙일 예정)
  const [alertCount] = useState(0);

  // ✅ 로고 클릭: 로그인 여부에 따라 기본 리스트로 이동
  const handleMainPage = () => {
    if (role === USER_ROLE.MEMBER) {
      router.push('/member/notice');
    } else {
      router.push('/guest/notice');
    }
  };

  // ✅ 왼쪽 메뉴 버튼: 로그인 X → /login, 로그인 O → 내 프로필/내 가게
  const handleMyPage = () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    if (role === USER_ROLE.MEMBER) {
      // 알바님: 내 프로필 페이지
      router.push('/member');
    } else if (role === USER_ROLE.OWNER) {
      // 사장님: 내 가게 페이지
      router.push('/owner');
    }
  };
  // ✅ 로그아웃: clearAuth() 후 /posts 로 이동
  const handleLogout = () => {
    if (isLoggedIn) {
      clearAuth();
    }
    router.push('/posts');
  };

  // (추후 구현용) 알림 아이콘 클릭
  const handleAlarm = () => {
    // TODO: 알림 모달 / 드롭다운 열기
    // 일단은 콘솔 출력으로만
    console.log('알림 아이콘 클릭');
  };

  const handleSearch = (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    const base = role === USER_ROLE.MEMBER ? '/member/notice' : '/guest/notice';
    router.push(`${base}?keyword=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(keyword);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  // 버튼 라벨
  const firstLabel = !isLoggedIn ? '로그인' : role === 'owner' ? '내 가게' : '내 프로필';
  const secondLabel = isLoggedIn ? '로그아웃' : '회원가입';

  const SearchField = (
    <div className="flex gap-2.5 bg-gray-10 rounded-[10px] p-2.5 w-full">
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
        className="focus:outline-none w-full bg-transparent"
        value={keyword}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );

  return (
    <header className="flex justify-center items-center w-full bg-white py-[15px]">
      <div className="w-full max-w-240 px-4 sm:px-6 lg:px-12 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 flex-1 min-w-0">
            <Image
              src="/images/logo.svg"
              alt="로고"
              width={109}
              height={20}
              className="cursor-pointer"
              onClick={handleMainPage}
            />
            <div className="hidden md:block flex-1 max-w-[480px]">{SearchField}</div>
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              className="cursor-pointer select-none tj-body1-bold whitespace-nowrap"
              onClick={handleMyPage}
            >
              {firstLabel}
            </button>

            <button
              type="button"
              className="cursor-pointer select-none tj-body1-bold whitespace-nowrap"
              onClick={isLoggedIn ? handleLogout : () => router.push('/signup')}
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

        <div className="block md:hidden w-full">{SearchField}</div>
      </div>
    </header>
  );
}

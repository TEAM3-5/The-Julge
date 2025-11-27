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

  // ✅ 로고 클릭: 로그인 여부와 관계없이 항상 /posts 로 이동
  //    메뉴 구성은 isLoggedIn + role 에 따라 자동으로 바뀜
  const handleMainPage = () => {
    router.push('/posts');
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

  // 버튼 라벨
  const firstLabel = !isLoggedIn ? '로그인' : role === 'owner' ? '내 가게' : '내 프로필';
  const secondLabel = isLoggedIn ? '로그아웃' : '회원가입';
  return (
    <div className="flex justify-between items-center w-full pl-52 pr-52">
      <div className="flex items-center gap-10">
        {/* 로고: 항상 /posts 로 보내고, 메뉴는 상태에 따라 변경 */}
        <Image
          src="/images/logo.svg"
          alt="로고"
          width={109}
          height={20}
          className="cursor-pointer"
          onClick={handleMainPage}
        />
        <div className="flex gap-2.5 bg-gray-10 rounded-[10px] mt-[15px] mb-[15px] p-2.5 min-w-[450px]">
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
        {/* 왼쪽 버튼: 로그인 / 내 가게 / 내 프로필 */}
        <button
          type="button"
          className="cursor-pointer select-none tj-body1-bold"
          onClick={handleMyPage}
        >
          {firstLabel}
        </button>

        {/* 오른쪽 버튼: 회원가입 / 로그아웃 */}
        <button
          type="button"
          className="cursor-pointer select-none tj-body1-bold"
          onClick={isLoggedIn ? handleLogout : () => router.push('/signup')}
        >
          {secondLabel}
        </button>

        {/* 로그인 상태에서만 알림 아이콘 표시 */}
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

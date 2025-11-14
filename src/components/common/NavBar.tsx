import Image from 'next/image';

export default function NavBar() {
  return (
    <div className="flex justify-center items-center">
      <div className="flex justify-evenly items-center w-full">
        <div className="flex justify-center items-center gap-10">
          <Image
            src="/images/logo.svg"
            alt="로고"
            width={109}
            height={20}
            className="cursor-pointer"
          />
          <div className="flex gap-2.5 bg-[#F2F2F3] rounded-[10px] mt-[15px] mb-[15px] p-2.5 w-[450px]">
            <Image
              src="/images/search.svg"
              alt="검색 돋보기"
              width={20}
              height={20}
              className="cursor-pointer"
            />
            <input placeholder="가게 이름으로 찾아보세요" className="focus:outline-none w-full" />
          </div>
        </div>
        <div className="flex justify-center items-center gap-10">
          <div className="cursor-pointer select-none">내 가게</div>
          <div className="cursor-pointer select-none">로그아웃</div>
          <Image
            src="/images/notification.svg"
            alt="알림 열람 아이콘"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

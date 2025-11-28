'use client';

import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="flex justify-between w-full py-[37px] px-[238px] bg-gray-10 tj-body1-regular text-gray-50">
      <div className="select-none">codeit - 2025</div>

      <div className="flex gap-7.5">
        <div className="cursor-pointer select-none">Privacy Policy</div>
        <div className="cursor-pointer select-none">FAQ</div>
      </div>

      <div className="flex gap-2.5">
        <Image
          src="/images/email.svg"
          alt="이메일 아이콘"
          width={25}
          height={25}
          className="cursor-pointer"
        />
        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
          <Image
            src="/images/facebook.svg"
            alt="페이스북 아이콘"
            width={25}
            height={25}
            className="cursor-pointer"
          />
        </a>
        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
          <Image
            src="/images/instagram.svg"
            alt="인스타그램 아이콘"
            width={25}
            height={25}
            className="cursor-pointer"
          />
        </a>
      </div>
    </footer>
  );
}

'use client';

import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-10 text-gray-50 tj-body1-regular">
      <div className="grid grid-cols-2 gap-y-10 mx-auto sm:grid-cols-3 w-full md:max-w-240 sm:flex-col sm:gap-4 px-6 py-9">
        <div className="select-none order-3 sm:order-1">codeit - 2025</div>

        <div className="order-1 flex sm:justify-center gap-6 sm:order-2">
          <div className="cursor-pointer select-none">Privacy Policy</div>
          <div className="cursor-pointer select-none">FAQ</div>
        </div>

        <div className="order-2 flex justify-end w-full gap-3 sm:order-3">
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
      </div>
    </footer>
  );
}

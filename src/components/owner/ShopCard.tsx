'use client';

import Button from '@/components/common/Button';
import Image from 'next/image';
import PostPath from '@/components/post/icon/PostPath';

export type ShopCardProps = {
  heading: string; // 섹션 제목
  thumbnailUrl: string; // 좌측 썸네일 이미지 URL
  category?: string; // 가게 이름 위에 붙는 라벨
  name: string; // 가게 이름
  locationText: string; // 가게 위치
  detailLocationText?: string; // 가게 상세 주소
  description: string; // 가게 소개 문구
  editHref: string; // 편집하기 버튼 클릭시 이동할 경로
  createPostingHref: string; // 공고 등록하기 버튼 클릭시 이동할 경로
  className?: string;
};

export function ShopCard({
  heading,
  thumbnailUrl,
  category = '식당',
  name,
  locationText,
  detailLocationText,
  description,
  editHref,
  createPostingHref,
  className,
}: ShopCardProps) {
  // 주소 표시 문자열
  const fullLocation = detailLocationText ? `${locationText} ${detailLocationText}` : locationText;

  // DNS 안 되는 도메인 fallback 처리
  const safeThumbnailUrl = thumbnailUrl.includes('via.placeholder.com')
    ? 'https://placehold.co/400x300?text=Shop' // 다른 정상 도메인
    : thumbnailUrl;

  return (
    <section className={`flex flex-col gap-6 ${className ?? ''}`}>
      <span className="tj-h1 text-gray-black">{heading}</span>

      <div className="flex flex-col justify-between gap-3 md:gap-7.5 md:flex-row bg-red-10 rounded-[12px] p-6">
        <div className="relative overflow-hidden rounded-[12px] w-full md:w-[539px] h-[178px] md:h-[308px]">
          <Image src={safeThumbnailUrl} alt={name} fill className="object-cover" unoptimized />
        </div>

        <div className="flex flex-col justify-between gap-10 md:gap-4 pt-4 w- full md:w-[346px]">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <span className="tj-body1-bold text-primary">{category}</span>
              <span className="tj-h1 text-gray-black">{name}</span>
            </div>

            <div className="flex flex-row items-center gap-1.5">
              <PostPath className="w-5 h-5 text-[#F48A71]" />
              <span className="tj-body1 text-gray-50">{fullLocation}</span>
            </div>

            <span className="tj-body1 text-black">{description}</span>
          </div>

          <div className="flex gap-2 justify-between">
            <Button variant="outline" size="medium" href={editHref} className="flex-1">
              편집하기
            </Button>

            <Button size="medium" href={createPostingHref} className="flex-1">
              공고 등록하기
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

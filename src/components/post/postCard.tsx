"use client";

import Image from "next/image";
import PostArrow from "./icon/PostArrow";
import PostPath from "./icon/PostPath";
import PostClock from "./icon/PostClock";

type PostStatus = "active" | "inactive";

export type PostCardProps = {
  status?: PostStatus;          // 공고 상태 (기본값: active)
  title: string;                // 공고 제목
  scheduleText: string;         // 날짜/시간 텍스트
  locationText: string;         // 위치 텍스트
  wage: number;                 // 시급
  wageBadgeText?: string;       // 뱃지 텍스트 (예: "기존 시급보다 100%")
  thumbnailUrl: string;         // 상단 썸네일 이미지 URL
  onClick?: () => void;         // 카드 클릭 핸들러
  className?: string;           // 페이지에서 tailwind 속성 추가
};

export function PostCard({
  status = "active",
  title,
  scheduleText,
  locationText,
  wage,
  wageBadgeText,
  thumbnailUrl,
  onClick,
  className,
}: PostCardProps) {
  const isInactive = status === "inactive";

  // 작은 카드(모바일에서 사용) 날짜/시간 분리
  const [datePart, ...rest] = scheduleText.split(" ");
  const timePart = rest.join(" ");

  return (
    <article
      onClick={onClick}
      className={`
        relative flex flex-col rounded-xl
        border border-gray-20 bg-white
        w-[171px] min-h-[260px] p-3 gap-3
        md:w-[312px] md:h-[348px] md:p-4 md:gap-5
        cursor-pointer
        ${className ?? ""}
      `}
    >
      {/* =================== 썸네일 영역 =================== */}
      <div
        className="
          relative overflow-hidden rounded-xl
          w-[147px] h-[84px]
          md:w-[280px] md:h-40
          "
      >
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover"
        />

        {/* 비활성(지난 공고) 오버레이 */}
        {isInactive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <span className="text-gray-30 tj-h3 md:tj-h1">
              지난 공고
            </span>
          </div>
        )}
      </div>

      {/* =================== 내용 영역 =================== */}
      <div className="flex flex-1 flex-col justify-between gap-4">
        {/* 제목 + 메타 정보 (날짜/위치) */}
        <div className="flex flex-col gap-2">
          {/* 제목 */}
          <h3
            className={`
              ${isInactive ? "text-gray-30" : "text-gray-black"}
              tj-body1-bold md:tj-h3
            `}
          >
            {title}
          </h3>
          <p
            className={`
              flex gap-1.5
              ${isInactive ? "text-gray-30" : "text-gray-50"}
              tj-caption md:tj-body2
            `}
          >
            <PostClock
              className={`w-4 h-4 md:w-5 md:h-5 ${isInactive ? "text-gray-20" : "text-red-30"}`} />

            {/* 모바일 날짜/시간 두 줄로 표시 */}
            <span className="flex flex-col md:hidden">
              <span>{datePart}</span>
              <span>{timePart}</span>
            </span>

            {/* md(태블릿) 이상 날짜/시간 한 줄로 표시 */}
            <span className="hidden md:inline">{scheduleText}</span>
          </p>

          {/* 위치 줄 */}
          <p
            className={`
              flex gap-1.5
              tj-caption md:tj-body2
              ${isInactive ? "text-gray-30" : "text-gray-50"}
            `}
          >
            <PostPath
              className={`w-4 h-4 md:w-5 md:h-5 ${isInactive ? "text-gray-20" : "text-red-30"}`} />
            <span>{locationText}</span>
          </p>
        </div>

        {/* =================== 시급 텍스트 =================== */}
        <div className={`flex items-end flex-wrap md:justify-between`}>
          <p
            className={`
              tj-h4 md:tj-h2
              w-full md:w-auto
              ${isInactive ? "text-gray-30" : "text-gray-black"}
            `}
          >
            {wage.toLocaleString()}원
          </p>

          {wageBadgeText && (
            <>
              {/* md(태블릿 이상) 뱃지 */}
              <div
                className={`
                  hidden md:flex items-center justify-center rounded-[20px] h-9 p-3
                  ${isInactive ? "bg-gray-20 text-white" : "bg-red-40 text-white"}
                  tj-caption md:tj-body2-bold
                `}
              >
                <span>{wageBadgeText}</span>
                <PostArrow
                  className="w-5 h-5 text-white" />
              </div>

              {/* 모바일 가격 아래 문구 */}
              <div className="flex md:hidden">
                <span className={`flex tj-caption text-center gap-0.5 ${isInactive ? "text-gray-20" : "text-red-40"}`}>
                  {wageBadgeText}
                  <PostArrow
                    className={`w-4 h-4 ${isInactive ? "text-gray-20" : "text-red-40"}`} />
                </span>
              </div>
            </>
          )}
          
        </div>
      </div>
    </article>
  );
}

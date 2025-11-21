// src/components/post/PostCard.tsx
"use client";

import Image from "next/image";
import React from "react";

type PostStatus = "active" | "inactive";
type PostSize = "large" | "small";

export type PostCardProps = {
  status?: PostStatus;      // 기본 active
  size?: PostSize;          // 기본 large (반응형 small은 나중에 튜닝)
  title: string;
  scheduleText: string;
  locationText: string;
  wage: number;
  wageBadgeText?: string;
  thumbnailUrl: string;
  onClick?: () => void;
};

const SIZE_STYLE = {
  large: {
    card: "w-[312px] min-h-[348px]", // Figma 카드 312 x 348
    image: "h-[160px]",              // 이미지 프레임 280 x 160
  },
  small: {
    // 반응형 카드 만들 때 여기 값만 수정해서 쓰면 됨
    card: "w-[171px] min-h-[260px]",
    image: "h-[120px]",
  },
} as const;

export function PostCard({
  status = "active",
  size = "large",
  title,
  scheduleText,
  locationText,
  wage,
  wageBadgeText,
  thumbnailUrl,
  onClick,
}: PostCardProps) {
  const isInactive = status === "inactive";
  const sizeStyle = SIZE_STYLE[size];

  return (
    <article
      onClick={onClick}
      className={[
        "relative flex flex-col gap-4",
        "rounded-[12px] border border-gray-20",
        "bg-white p-4 shadow-sm transition-shadow hover:shadow-md",
        sizeStyle.card,
        "cursor-pointer",
        isInactive && "bg-gray-10 hover:shadow-sm",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* 이미지 영역 */}
      <div
        className={[
          "relative w-full overflow-hidden rounded-[12px]",
          sizeStyle.image,
        ].join(" ")}
      >
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="312px"
        />

        {isInactive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55">
            <span className="tj-h3 text-white">지난 공고</span>
          </div>
        )}
      </div>

      {/* 내용 + 하단 영역 */}
      <div className="flex flex-1 flex-col justify-between gap-4">
        {/* 텍스트들 */}
        <div className="flex flex-col gap-2">
          {/* 제목 */}
          <h3
            className={[
              "tj-h3",
              isInactive ? "text-gray-30" : "text-gray-black",
            ].join(" ")}
          >
            {title}
          </h3>

          {/* 날짜/시간 */}
          <p
            className={[
              "flex items-center gap-1",
              "tj-body2",
              isInactive ? "text-gray-30" : "text-gray-50",
            ].join(" ")}
          >
            {/* 시계 아이콘 (나중에 SVG 교체 가능) */}
            <span className="inline-block h-4 w-4 rounded-full bg-primary/80" />
            <span>{scheduleText}</span>
          </p>

          {/* 위치 */}
          <p
            className={[
              "flex items-center gap-1",
              "tj-body2",
              isInactive ? "text-gray-30" : "text-gray-50",
            ].join(" ")}
          >
            <span className="inline-block h-4 w-4 rounded-full bg-primary" />
            <span>{locationText}</span>
          </p>
        </div>

        {/* 시급 + 뱃지 */}
        <div className="flex items-center justify-between">
          <p
            className={[
              "tj-h2",
              isInactive ? "text-gray-30" : "text-gray-black",
            ].join(" ")}
          >
            {wage.toLocaleString()}원
          </p>

          {wageBadgeText && (
            <span
              className={[
                "inline-flex items-center justify-center",
                "rounded-full px-3 py-[6px]",
                "tj-body2-bold",
                isInactive ? "bg-gray-20 text-gray-40" : "bg-red-40 text-white",
              ].join(" ")}
            >
              {wageBadgeText}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

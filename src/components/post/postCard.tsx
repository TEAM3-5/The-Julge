"use client";

import Image from "next/image";
import PostArrow from "./icon/PostArrow";
import PostPath from "./icon/PostPath";
import PostClock from "./icon/PostClock";

type PostStatus = "active" | "inactive";
type PostSize = "large" | "small";

export type PostCardProps = {
  status?: PostStatus;          // 공고 상태 (기본값: active)
  size?: PostSize;              // 카드 크기 (기본값: large)
  title: string;                // 공고 제목
  scheduleText: string;         // 날짜/시간 텍스트
  locationText: string;         // 위치 텍스트
  wage: number;                 // 시급
  wageBadgeText?: string;       // 뱃지 텍스트 (예: "기존 시급보다 100%")
  thumbnailUrl: string;         // 상단 썸네일 이미지 URL
  onClick?: () => void;         // 카드 클릭 핸들러
};

/**
 * 큰 카드/작은 카드 스타일
 */
const SIZE_STYLE = {
  large: {
    card: "w-[312px] h-[348px] p-4 gap-5",
    imageWrapper: "w-[280px] h-[160px]",
    title: "tj-h3",
    meta: "tj-body2",
    wage: "tj-h2",
    wageIncrease: "tj-body2-bold",
    iconSize: 20,
    inactiveLabel: "tj-h1",
  },
  small: {
    card: "w-[171px] min-h-[260px] p-3 gap-3",
    imageWrapper: "w-[147px] h-[84px]",
    title: "tj-body1-bold",
    meta: "tj-caption",
    wage: "tj-h4",
    wageIncrease: "tj-caption",
    iconSize: 16,
    inactiveLabel: "tj-h3",
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
  const styles = SIZE_STYLE[size];

  // 작은 카드 날짜/시간 분리
  const renderScheduleText = () => {
    if (size === "small") {
      const [datePart, ...rest] = scheduleText.split(" ");
      const timePart = rest.join(" ");
      return (
        <span className="flex flex-col">
          <span>{datePart}</span>
          <span>{timePart}</span>
        </span>
      );
    }
  }
  /** 날짜/위치 렌더링 */
  const renderMeta = () => (
    <>
      {/* 날짜/시간 줄 */}
      <p
        className={[
          "flex gap-1.5",
          styles.meta,
          isInactive ? "text-gray-30" : "text-gray-50",
        ].join(" ")}
      >
        <PostClock
          width={styles.iconSize}
          height={styles.iconSize}
          className={isInactive ? "text-gray-20" : "text-red-30"} />
        {size === "small" ? renderScheduleText() : scheduleText}
      </p>

      {/* 위치 줄 */}
      <p
        className={[
          "flex gap-1.5",
          styles.meta,
          isInactive ? "text-gray-30" : "text-gray-50",
        ].join(" ")}
      >
        <PostPath
          width={styles.iconSize}
          height={styles.iconSize}
          className={isInactive ? "text-gray-20" : "text-red-30"} />
        <span>{locationText}</span>
      </p>
    </>
  );

  /** 큰 카드 전용 문구 뱃지*/
  const renderLargeBadge = () => {
    if (!wageBadgeText) return null;

    const baseColor = isInactive ? "bg-gray-20 text-white" : "bg-red-40 text-white";

    return (
      <div
        className={[
          "flex items-center justify-center rounded-[20px] h-9 p-3",
          baseColor,
          styles.wageIncrease,
        ].join(" ")}
      >
        <span>{wageBadgeText}</span>
        <PostArrow
          width={styles.iconSize}
          height={styles.iconSize}
          className="text-white" />
      </div>
    );
  };

  /** 작은 카드 전용 가격 아래 문구 */
  const renderSmallBadge = () => {
    if (!wageBadgeText) return null;

    const baseColor = isInactive ? "text-gray-20" : "text-red-40";

    return (
      <div>
        <div
          className={[
            baseColor,
          ].join(" ")}
        >
          <span className="flex tj-caption text-center gap-0.5">
            {wageBadgeText}
            <PostArrow
              width={styles.iconSize}
              height={styles.iconSize}
              className={isInactive ? "text-gray-20" : "text-red-40"} />
          </span>
        </div>
      </div>
    );
  };

  /** 사이즈별로 다른 뱃지 렌더링 */
  const renderBadge = () => {
    if (!wageBadgeText) return null;
    if (size === "large") return renderLargeBadge();
    return renderSmallBadge();
  };

  return (
    <article
      onClick={onClick}
      className={[
        "relative flex flex-col rounded-xl",
        "border border-gray-20 bg-white",
        styles.card,
        "cursor-pointer",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* =================== 썸네일 영역 =================== */}
      <div
        className={[
          "relative w-full overflow-hidden rounded-xl",
          styles.imageWrapper,
        ].join(" ")}
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
            <span className={[
              styles.inactiveLabel,
              "text-gray-30",
              ].join(" ")}>
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
            className={[
              styles.title,
              isInactive ? "text-gray-30" : "text-gray-black",
            ].join(" ")}
          >
            {title}
          </h3>
          {renderMeta()}
        </div>

        {/* =================== 시급 텍스트 =================== */}
        <div className={["flex items-end", size === "large" ? "justify-between" : "flex-wrap"].join(" ")}>
          <p
            className={[
              styles.wage,
              isInactive ? "text-gray-30" : "text-gray-black",
            ].join(" ")}
          >
            {wage.toLocaleString()}원
          </p>
          {/* large 에서는 같은 줄에 렌더링, small 에서는 아래에 렌더링 */}
          {renderBadge()}
        </div>
            
      </div>


    </article>
  );
}

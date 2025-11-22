"use client";

import Image from "next/image";

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
 *  - card: 카드 전체 폭/패딩/최소 높이
 *  - imageWrapper: 썸네일 높이
 *  - title/meta/wage: 텍스트 스타일
 *  - smallExtraBottom: 작은 카드에서 동그란 뱃지를 위해 여유 공간
 */
const SIZE_STYLE = {
  large: {
    card: "w-[312px] h-[348px] p-3 rounded-[12px]",
    imageWrapper: "w-[280px] h-[160px]",
    title: "tj-h3",
    meta: "tj-body2",
    wage: "tj-h2",
    wageIncrease: "tj-body2-bold",
    iconSize: 20,
  },
  small: {
    card: "w-[171px] min-h-[260px] p-3 rounded-[12px]",
    imageWrapper: "w-[147px] h-[84px]",
    title: "tj-body1-bold",
    meta: "tj-caption",
    wage: "tj-h4-bold",
    wageIncrease: "tj-caption",
    iconSize: 16,
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

  /** 공통: 날짜/위치 줄 렌더링 */
  const renderMeta = () => (
    <>
      {/* 날짜/시간 줄 */}
      <p
        className={[
          "flex items-center gap-2",
          styles.meta,
          isInactive ? "text-gray-30" : "text-gray-50",
        ].join(" ")}
      >
        <Image
          src="/images/Post-clock.svg"
          alt="시간 아이콘"
          width={styles.iconSize}
          height={styles.iconSize}
        />
        <span>{scheduleText}</span>
      </p>

      {/* 위치 줄 */}
      <p
        className={[
          "flex items-center gap-2",
          styles.meta,
          isInactive ? "text-gray-30" : "text-gray-50",
        ].join(" ")}
      >
        <Image
          src="/images/Post-path.svg"
          alt="위치 아이콘"
          width={styles.iconSize}
          height={styles.iconSize}
        />
        <span>{locationText}</span>
      </p>
    </>
  );

  /** 큰 카드 전용 가로형 뱃지*/
  const renderLargeBadge = () => {
    if (!wageBadgeText) return null;

    const baseColor = isInactive ? "bg-gray-20 text-white" : "bg-red-40 text-white";

    return (
      <div
        className={[
          "flex items-center justify-between rounded-[20px] h-9 p-3",
          baseColor,
          styles.wageIncrease,
        ].join(" ")}
      >
        <span>{wageBadgeText}</span>
        {/* 오른쪽 동그란 화살표 아이콘 부분 */}
          <Image
            src="/images/Post-arrow.svg"
            alt="상승 아이콘"
            width={styles.iconSize}
            height={styles.iconSize}
          />
      </div>
    );
  };

  /** 작은 카드 전용 동그란 배지 (카드 밖으로 튀어나오는 느낌) */
  const renderSmallBadge = () => {
    if (!wageBadgeText) return null;

    const baseColor = isInactive ? "text-gray-20" : "text-red-40";

    return (
      <div className="pointer-events-none">
        <div
          className={[
            "items-center justify-center",
            baseColor,
          ].join(" ")}
        >
          {/* 텍스트는 2줄 정도로 줄바꿈되도록 중앙 정렬 */}
          <span className="tj-caption text-center leading-tight">
            {wageBadgeText}
          </span>
          <span
            className={[
              "mt-1 flex h-4 w-4 items-center justify-center rounded-full",
            
            ].join(" ")}
          >
            <Image
              src="/images/Post-arrow.svg"
              alt="상승 아이콘"
              width={10}
              height={10}
            />
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
        "relative flex flex-col gap-4 rounded-5",
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
          "relative w-full overflow-hidden rounded-[20px]",
          styles.imageWrapper,
        ].join(" ")}
      >
        {/* fill + object-cover 로 카드 크기에 맞게 잘라서 표시 */}
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover"
          sizes={size === "large" ? "312px" : "171px"}
        />

        {/* 비활성(지난 공고) 오버레이 */}
        {isInactive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55">
            <span className="tj-h3 text-white">지난 공고</span>
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
        <div className="flex items-end justify-between">
          <p
            className={[
              styles.wage,
              isInactive ? "text-gray-30" : "text-gray-black",
            ].join(" ")}
          >
            {wage.toLocaleString()}원
          </p>

          {/* large 에서는 같은 줄에 가로형 뱃지, small 에서는 아래에서 동그라미로 렌더링 */}
          {size === "large" && renderBadge()}
        </div>
      </div>

      {/* small 전용 동그란 뱃지는 카드 오른쪽 아래에 따로 올려놓음 */}
      {size === "small" && renderBadge()}
    </article>
  );
}

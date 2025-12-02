'use client';

import Image from 'next/image';
import { memo, useMemo, useState } from 'react';
import PostArrow from './icon/PostArrow';
import PostPath from './icon/PostPath';
import PostClock from './icon/PostClock';

type PostStatus = 'active' | 'inactive';

export type PostCardProps = {
  id?: string | number;          // 카드 id
  status?: PostStatus;           // 공고 상태 (기본값: active)
  title: string;                 // 공고 제목
  scheduleText: string;          // 날짜/시간 텍스트
  locationText: string;          // 위치 텍스트
  wage: number;                  // 시급
  wageBadgeText?: string;        // 뱃지 텍스트 (예: "시급 30% ↑", 없으면 빈 슬롯)
  thumbnailUrl?: string;         // 상단 썸네일 이미지 URL (없으면 플레이스홀더)
  onClick?: () => void;          // 카드 클릭 핸들러
  className?: string;            // 페이지에서 tailwind 속성 추가
  thumbnailClassName?: string;
  inactiveLabelText?: string;    // 비활성화 썸네일 문구 (지난 공고/마감 완료)
};

/* ================================
 * 시급 증가율(%)에 따른 색상 계산 헬퍼들
 * - 증가율에 따라 red-20 / red-30 / red-40 분기
 * ================================ */

function getIncreasePercent(text?: string): number {
  if (!text) return 0;
  const match = text.match(/(\d+)\s*%/); // "30%" 또는 "30 %" 같은 경우
  return match ? Number(match[1]) : 0;
}

function getDesktopBadgeClass(isInactive: boolean, percent: number): string {
  if (isInactive) return 'bg-gray-20 text-white';

  if (percent >= 50) return 'bg-red-40 text-white';
  if (percent >= 30) return 'bg-red-30 text-white';
  if (percent > 0) return 'bg-red-20 text-white';

  // 0%거나 %가 없을 때는 색 없음 (빈 슬롯)
  return '';
}

function getMobileBadgeColorClass(isInactive: boolean, percent: number): string {
  if (isInactive) return 'text-gray-20';

  if (percent >= 50) return 'text-red-40';
  if (percent >= 30) return 'text-red-30';
  if (percent > 0) return 'text-red-20';

  // 0%는 색 없음
  return '';
}

export const PostCard = memo(function PostCard({
  id,
  status = 'active',
  title,
  scheduleText,
  locationText,
  wage,
  wageBadgeText,
  thumbnailUrl,
  onClick,
  className,
  thumbnailClassName,
  inactiveLabelText = '지난 공고',
}: PostCardProps) {
  const isInactive = status === 'inactive';
  const resolvedThumbnail =
    !thumbnailUrl || thumbnailUrl.includes('via.placeholder.com')
      ? '/images/no-image.png'
      : thumbnailUrl;

  const [hasImageError, setHasImageError] = useState<boolean>(() => !resolvedThumbnail);

  // 작은 카드(모바일에서 사용) 날짜/시간 분리
  const [datePart, timePart] = useMemo(() => {
    const [date, ...rest] = scheduleText.split(' ');
    return [date, rest.join(' ')];
  }, [scheduleText]);

  // 시급 증가율(%) 파싱 및 색상 클래스 계산
  const increasePercent = getIncreasePercent(wageBadgeText);
  const desktopBadgeClass = getDesktopBadgeClass(isInactive, increasePercent);
  const mobileBadgeColorClass = getMobileBadgeColorClass(isInactive, increasePercent);

  // 실제로 텍스트/아이콘이 보이는 뱃지인지 여부 (0%면 안 보이게)
  const showBadge = !!wageBadgeText && increasePercent > 0;

  return (
    <article
      id={id ? `post-card-${id}` : undefined}
      onClick={onClick}
      className={`relative flex flex-col rounded-xl border border-gray-20 bg-white cursor-pointer
        w-full p-3 gap-3 md:p-4 md:gap-5
        ${className ?? ''}
      `}
    >
      {/* =================== 썸네일 영역 =================== */}
      <div
        className={`relative overflow-hidden rounded-xl
          w-full h-[84px] md:h-40
          ${thumbnailClassName ?? ''}
        `}
      >
        {hasImageError ? (
          <div className="flex h-full w-full items-center justify-center bg-gray-10 text-gray-40">
            <span className="tj-body2">이미지 없음</span>
          </div>
        ) : (
          <Image
            src={resolvedThumbnail}
            alt={title}
            fill
            className="object-cover"
            onError={() => setHasImageError(true)}
          />
        )}

        {/* 비활성(지난 공고) 오버레이 */}
        {isInactive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-gray-30">
            <span className="block md:hidden tj-h3">{inactiveLabelText}</span>
            <span className="hidden md:block tj-h1">{inactiveLabelText}</span>
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
              ${isInactive ? 'text-gray-30' : 'text-gray-black'}
            `}
          >
            <span className="block md:hidden tj-body1-bold truncate">{title}</span>
            <span className="hidden md:block tj-h3 truncate">{title}</span>
          </h3>
          <p
            className={`
              flex gap-1.5
              ${isInactive ? 'text-gray-30' : 'text-gray-50'}
            `}
          >
            <PostClock
              className={`w-4 h-4 md:w-5 md:h-5 ${isInactive ? 'text-gray-20' : 'text-red-30'}`}
            />

            {/* 모바일 날짜/시간 두 줄로 표시 */}
            <span className="flex flex-col md:hidden tj-caption">
              <span>{datePart}</span>
              <span>{timePart}</span>
            </span>

            {/* md(태블릿) 이상 날짜/시간 한 줄로 표시 */}
            <span className="hidden md:inline tj-body2">{scheduleText}</span>
          </p>

          {/* 위치 줄 */}
          <p
            className={`
              flex gap-1.5
              ${isInactive ? 'text-gray-30' : 'text-gray-50'}
            `}
          >
            <PostPath
              className={`w-4 h-4 md:w-5 md:h-5 ${isInactive ? 'text-gray-20' : 'text-red-30'}`}
            />
            <span className="hidden md:inline tj-body2">{locationText}</span>
            <span className="inline md:hidden tj-caption">{locationText}</span>
          </p>
        </div>

        {/* =================== 시급 텍스트 + 뱃지 슬롯 =================== */}
        <div className="flex items-end flex-wrap md:justify-between">
          <p
            className={`
              w-full md:w-auto
              ${isInactive ? 'text-gray-30' : 'text-gray-black'}
            `}
          >
            <span className="hidden md:block tj-h2">{wage.toLocaleString()}원</span>
            <span className="block md:hidden tj-h4">{wage.toLocaleString()}원</span>
          </p>

          {/* md 이상: 항상 슬롯은 있고, showBadge일 때만 내용 보임 */}
          <div
            className={`
              hidden md:flex items-center justify-center rounded-[20px] h-9 p-3
              ${showBadge ? desktopBadgeClass : ''}
            `}
          >
            {showBadge ? (
              <>
                <span className="tj-body2-bold">{wageBadgeText}</span>
                <PostArrow className="w-5 h-5 text-white" />
              </>
            ) : (
              // 빈 슬롯: 높이만 맞추기 위해 투명 텍스트
              <span className="tj-body2-bold opacity-0">placeholder</span>
            )}
          </div>

          {/* 모바일: 역시 슬롯은 항상 있고, showBadge일 때만 색/내용 표시 */}
          <div className="flex md:hidden text-center gap-0.5">
            {showBadge ? (
              <>
                <span className={`tj-caption ${mobileBadgeColorClass}`}>{wageBadgeText}</span>
                <PostArrow className={`w-4 h-4 ${mobileBadgeColorClass}`} />
              </>
            ) : (
              <>
                <span className="tj-caption opacity-0">&nbsp;</span>
                <PostArrow className="w-4 h-4 opacity-0" />
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
});

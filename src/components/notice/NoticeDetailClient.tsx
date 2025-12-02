'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { isAxiosError } from 'axios';
import Button from '@/components/common/Button';
import { getNotice } from '@/api/notices';

type NoticeDetail = {
  id: string;
  title: string;
  wage: number;
  wageBadgeText?: string;
  startsAt?: string;
  workhour?: number;
  location?: string;
  description?: string;
  thumbnailUrl?: string;
};

type NoticeDetailClientProps = {
  noticeId: string;
};

const formatStartsAt = (startsAt?: string, workhour?: number) => {
  if (!startsAt) return '날짜/시간 정보 없음';
  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) return '날짜/시간 정보 없음';
  const text = date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
  return workhour ? `${text} (${workhour}시간)` : text;
};

export default function NoticeDetailClient({ noticeId }: NoticeDetailClientProps) {
  const [notice, setNotice] = useState<NoticeDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imgSrc, setImgSrc] = useState('/images/no-image.png');

  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();
  const shopId = searchParams.get('shopId') ?? undefined;
  const resolvedNoticeId = noticeId || params?.id;

  useEffect(() => {
    if (!shopId || !resolvedNoticeId) {
      setError('가게 ID와 공고 ID가 필요합니다. URL에 shopId와 noticeId를 포함해주세요.');
      return;
    }

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getNotice(shopId, resolvedNoticeId);
        const data = res.data?.item;
        if (!data) {
          setError('공고 정보를 불러오지 못했습니다.');
          return;
        }

        const safeThumb =
          data.shop?.item?.imageUrl && !data.shop.item.imageUrl.includes('via.placeholder.com')
            ? data.shop.item.imageUrl
            : '/images/no-image.png';

        const hourlyPay = Number(data.hourlyPay) || 0;
        const originalHourlyPay = Number(data.shop?.item?.originalHourlyPay) || 0;

        setNotice({
          id: data.id,
          title: data.shop?.item?.name ?? data.description ?? '공고',
          wage: hourlyPay,
          wageBadgeText:
            originalHourlyPay > 0 && hourlyPay > originalHourlyPay
              ? `시급 ${Math.round(((hourlyPay - originalHourlyPay) / originalHourlyPay) * 100)}%`
              : undefined,
          startsAt: data.startsAt,
          workhour: data.workhour,
          location: data.shop?.item?.address1 ?? data.shop?.item?.address2,
          description: data.description,
          thumbnailUrl: safeThumb,
        });
        setImgSrc(safeThumb);
      } catch (err: unknown) {
        console.error(err);
        if (isAxiosError(err)) {
          setError(err.response?.data?.message ?? '공고 정보를 불러오지 못했습니다.');
        } else {
          setError('공고 정보를 불러오지 못했습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [resolvedNoticeId, shopId]);

  if (error) {
    return (
      <main className="max-w-[964px] mx-auto px-6 py-10">
        <p className="text-red-40">{error}</p>
      </main>
    );
  }

  if (loading || !notice) {
    return (
      <main className="max-w-[964px] mx-auto px-6 py-10">
        <p className="text-gray-50">공고 정보를 불러오는 중...</p>
      </main>
    );
  }

  return (
    <div className="w-full max-w-[964px] mx-auto flex flex-col gap-y-30">
      <section>
        <div className="flex flex-col gap-6 px-6">
          <div className="flex flex-col gap-2">
            <span className="tj-body2 text-primary">식당</span>
            <h1 className="tj-h2 text-gray-black">{notice.title}</h1>
          </div>

          <div className="flex flex-col gap-6 rounded-xl border border-gray-20 bg-white p-6 md:flex-row">
            <div className="relative h-[260px] w-full overflow-hidden rounded-xl md:w-[360px]">
              <Image
                src={imgSrc}
                alt={notice.title}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 360px, 100vw"
                onError={() => setImgSrc('/images/no-image.png')}
              />
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="tj-body2 text-primary">시급</p>
                  <p className="tj-h1 text-gray-black">{notice.wage.toLocaleString()}원</p>
                </div>
                {notice.wageBadgeText && (
                  <span className="tj-body2-bold inline-flex items-center gap-1 rounded-full bg-red-40 px-3 py-2 text-white">
                    {notice.wageBadgeText}
                    <Image src="/icons/icon-arrow-up-bold.png" alt="" width={20} height={20} />
                  </span>
                )}
              </div>

              <div className="space-y-2 text-sm text-gray-50">
                <div className="flex items-center gap-2">
                  <Image src="/icons/icon-clock-primary.png" alt="" width={20} height={20} />
                  <span>{formatStartsAt(notice.startsAt, notice.workhour)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/icons/icon-location-primary.png" alt="" width={20} height={20} />
                  <span>{notice.location ?? '위치 정보 없음'}</span>
                </div>
              </div>

              <Button size="medium" className="bg-primary text-white w-full md:w-fit">
                신청하기
              </Button>
            </div>
          </div>

          <div className="rounded-xl bg-gray-10 p-8 text-gray-50">
            <h3 className="tj-body1-bold text-gray-black mb-2">공고 설명</h3>
            <p className="whitespace-pre-wrap">{notice.description ?? '설명 없음'}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

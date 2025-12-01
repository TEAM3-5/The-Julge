'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

import Button from '@/components/common/Button';
import PostClock from '@/components/post/icon/PostClock';
import PostPath from '@/components/post/icon/PostPath';

import { Table } from '@/components/common/Table';
import { Pagination } from '@/components/pagination/Pagination';

import { useAuthStore } from '@/stores/auth';
import { listNoticesAll } from '@/api/notices';
import { listApplicationsByNotice } from '@/api/applications';
import { useModalContext } from '@/components/modal/ModalProvider';
import { useToast } from '@/components/toast/toastProvider';
import PostArrow from '@/components/post/icon/PostArrow';

// 타입 정의

type NoticeShopItem = {
  id: string;
  name: string;
  category: string;
  address1: string;
  address2?: string;
  description: string;
  imageUrl: string;
  originalHourlyPay: number;
};

type NoticeItem = {
  id: string;
  hourlyPay: number;
  startsAt: string;
  workhour: number;
  description: string;
  closed: boolean;
  shop: {
    item: NoticeShopItem;
  };
};

type NoticeListItem = {
  item: NoticeItem;
};

type NoticeListData = {
  items?: NoticeListItem[];
};

type ApplicationUserItem = {
  id: string;
  name: string;
  phone?: string;
  bio?: string;
};

type ApplicationItem = {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  user?: { item?: ApplicationUserItem | null } | null;
};

type ApplicationListItem = {
  item: ApplicationItem;
};

type ApplicationListData = {
  items?: ApplicationListItem[];
};

type ApplicantRowStatus = 'pending' | 'approved' | 'rejected'; // 대기(거절하기, 승인하기 버튼) / 승인완료 / 거절 분기

type ApplicantRow = {
  id: string;
  name: string;
  intro: string;
  phone: string;
  status: ApplicantRowStatus;
};

// 날짜 변환 함수
function formatDateTime(iso: string) {
  try {
    const d = new Date(iso);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  } catch {
    return iso;
  }
}

// 시급 변동량 계산 함수
function calcHourlyDiffBadge(hourlyPay: number, originalHourlyPay: number) {
  if (!originalHourlyPay || originalHourlyPay <= 0) return '';
  const ratio = (hourlyPay / originalHourlyPay - 1) * 100;
  const rounded = Math.round(ratio);
  if (rounded <= 0) return '';
  return `기존 시급보다 ${rounded}%`;
}

/**
 * 공고 상세 페이지 컴포넌트
 */
export default function OwnerPostingDetailPage() {
  const router = useRouter();
  const params = useParams() as { postingId?: string | string[]; shopId?: string | string[] };
  const rawNoticeId = params.postingId;
  const postingId = Array.isArray(rawNoticeId) ? rawNoticeId[0] : (rawNoticeId ?? '');

  const user = useAuthStore((state) => state.user);
  const userId = user?.id ?? '';

  const { openAction } = useModalContext();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [notice, setNotice] = useState<NoticeItem | null>(null);
  const [shop, setShop] = useState<NoticeShopItem | null>(null);

  const [applicants, setApplicants] = useState<ApplicantRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  /* ------------------------- 데이터 로드 ------------------------- */

  useEffect(() => {
    if (!userId) return;
    if (!postingId) {
      setErrorMessage('공고 정보가 올바르지 않습니다.');
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        // 1) 전체 공고 조회 후 현재 공고 찾기
        const noticeRes = await listNoticesAll();
        const data = noticeRes.data as unknown as NoticeListData;

        const target = data.items?.find((entry) => entry.item?.id === postingId);
        if (!target) {
          throw new Error('해당 공고를 찾을 수 없습니다.');
        }

        const n = target.item;
        const s = n.shop.item;

        setNotice(n);
        setShop(s);

        // 2) 신청자 목록 조회
        const appsRes = await listApplicationsByNotice(s.id, n.id);
        const appsData = appsRes.data as unknown as ApplicationListData;

        const mapped: ApplicantRow[] =
          appsData.items?.map((entry) => {
            const app = entry.item;
            const userItem = app.user?.item ?? null;

            return {
              id: app.id,
              name: userItem?.name ?? '이름 없음',
              intro: userItem?.bio ?? '자기소개가 없습니다.',
              phone: userItem?.phone ?? '전화번호 미입력',
              status: app.status ?? 'pending',
            };
          }) ?? [];

        setApplicants(mapped);
      } catch (error: unknown) {
        console.error(error);
        let msg = '공고 정보를 불러오는 중 오류가 발생했습니다.';

        if (typeof error === 'object' && error !== null && 'response' in error) {
          const errWithResponse = error as {
            response?: { data?: { message?: string } };
          };

          const apiMessage = errWithResponse.response?.data?.message;
          if (typeof apiMessage === 'string' && apiMessage.length > 0) {
            msg = apiMessage;
          }
        } else if (error instanceof Error && error.message) {
          msg = error.message;
        }
        setErrorMessage(msg);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [userId, postingId]);

  /* ------------------------- 테이블 페이징 ------------------------- */

  const totalPages = useMemo(() => {
    if (applicants.length === 0) return 1;
    return Math.ceil(applicants.length / pageSize);
  }, [applicants.length]);

  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return applicants.slice(start, start + pageSize);
  }, [applicants, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  /* ------------------------- 승인 / 거절 핸들러 ------------------------- */

  const handleApprove = (id: string) => {
    openAction({
      title: '신청을 승인하시겠어요?',
      confirmText: '예',
      cancelText: '아니오',
      onConfirm: () => {
        // TODO: 승인 API 연동
        setApplicants((prev) =>
          prev.map((row) => (row.id === id ? { ...row, status: 'approved' } : row)),
        );
        showToast('신청이 승인되었습니다.', {
          variant: 'success',
          duration: 2000,
        });
      },
    });
  };

  const handleReject = (id: string) => {
    openAction({
      title: '신청을 거절하시겠어요?',
      confirmText: '예',
      cancelText: '아니오',
      onConfirm: () => {
        // TODO: 거절/취소 API 연동
        setApplicants((prev) =>
          prev.map((row) => (row.id === id ? { ...row, status: 'rejected' } : row)),
        );
        showToast('신청이 거절되었습니다.', {
          variant: 'error',
          duration: 2000,
        });
      },
    });
  };

  // 렌더링 분기

  if (!userId) {
    return (
      <main className="w-full bg-white flex flex-col items-center">
        <section className="py-15 w-full max-w-[964px] flex flex-col">
          <span className="tj-h1 text-gray-black">공고 상세</span>
          <p className="mt-4 tj-body1 text-red-500">
            로그인 정보가 없습니다. 먼저 로그인해 주세요.
          </p>
        </section>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="w-full bg-white flex flex-col items-center">
        <section className="py-15 w-full max-w-[964px] flex flex-col">
          <span className="tj-h1 text-gray-black">공고 상세</span>
          <p className="mt-4 tj-body1 text-gray-50">공고 정보를 불러오는 중입니다...</p>
        </section>
      </main>
    );
  }

  if (errorMessage || !notice || !shop) {
    return (
      <main className="w-full bg-white flex flex-col items-center">
        <section className="py-15 w-full max-w-[964px] flex flex-col">
          <span className="tj-h1 text-gray-black">공고 상세</span>
          <p className="mt-4 tj-body1 text-red-500">
            {errorMessage ?? '공고 정보를 불러오는 중 문제가 발생했습니다.'}
          </p>
          <div className="mt-6">
            <Button type="button" size="medium" onClick={() => router.push('/owner')}>
              내 가게로 돌아가기
            </Button>
          </div>
        </section>
      </main>
    );
  }

  /* ------------------------- 실제 화면 ------------------------- */

  const fullAddress = shop.address2 ? `${shop.address1} ${shop.address2}` : shop.address1;

  const startsAtText = `${formatDateTime(notice.startsAt)} (${notice.workhour}시간)`;

  const wageDiffBadge = calcHourlyDiffBadge(notice.hourlyPay, shop.originalHourlyPay);

  return (
    <main className="w-full flex flex-col items-center">
      {/* 가게 공고 상세 카드 */}
      <section className="w-full max-w-[964px] py-15 flex flex-col gap-6">
        {/* 가게 카테고리/이름 */}
        <div className="flex flex-col gap-2">
          <span className="tj-body1-bold text-primary">{shop.category}</span>
          <h1 className="tj-h1 text-black">{shop.name}</h1>
        </div>

        {/* 가게 상세 카드 */}
        <section className="rounded-[12px] border border-gray-20 bg-white px-6 py-6 flex gap-6">
          <div className="relative w-[539px] h-[308px] overflow-hidden rounded-[12px]">
            <Image src={shop.imageUrl} alt={shop.name} fill className="object-cover" unoptimized />
          </div>

          <div className="flex flex-col justify-between w-[346px] pt-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <span className="tj-body1-bold text-primary">시급</span>

                <div className="flex flex-row gap-2 items-center">
                  <p className="tj-h1 text-gray-black">
                    {notice.hourlyPay.toLocaleString('ko-KR')}원
                  </p>

                  {!wageDiffBadge || (
                    <span className="h-9 inline-flex items-center rounded-[20px] bg-primary text-white px-3 tj-body2-bold gap-0.5">
                      {wageDiffBadge}
                      <PostArrow className="w-5 h-5 text-white" />
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 tj-body1 text-gray-50">
                <PostClock className="w-5 h-5 text-red-30" />
                <span>{startsAtText}</span>
              </div>

              <div className="flex items-center gap-1.5 tj-body1 text-gray-50">
                <PostPath className="w-5 h-5 text-red-30" />
                <span>{fullAddress}</span>
              </div>

              <p className="tj-body1 text-gray-black">{shop.description}</p>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="medium"
                href={`/owner/shops/${shop.id}/postings/${postingId}/edit`}
                className="w-full min-w-[180px]"
              >
                공고 편집하기
              </Button>
            </div>
          </div>
        </section>

        {/* 공고 설명 카드 */}
        <div className="rounded-[12px] bg-gray-10 p-8 flex flex-col gap-3">
          <p className="tj-body1-bold text-gray-black">공고 설명</p>
          <p className="tj-body1 text-gray-black whitespace-pre-line">{notice.description}</p>
        </div>
      </section>

      {/* 신청자 목록 TABLE */}
      <section className="flex flex-col gap-8 w-full max-w-[964px] overflow-hidden ph-15">
        <p className="tj-h1 text-black">신청자 목록</p>

        {applicants.length === 0 ? (
          <p className="tj-body1 text-gray-50">아직 이 공고에 신청한 사람이 없습니다.</p>
        ) : (
          <>
            <div className="flex flex-col justify-center">
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.HeaderCell className="w-[228px] bg-red-10 px-[12px] py-[20px]">
                      신청자
                    </Table.HeaderCell>
                    <Table.HeaderCell className="w-[300px] bg-red-10 px-[12px] py-[20px]">
                      소개
                    </Table.HeaderCell>
                    <Table.HeaderCell className="w-[200px] bg-red-10 px-[12px] py-[20px]">
                      전화번호
                    </Table.HeaderCell>
                    <Table.HeaderCell className="text-left bg-red-10 px-[12px] py-[20px]">
                      상태
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {pageRows.map((row) => {
                    const isApproved = row.status === 'approved';
                    const isRejected = row.status === 'rejected';

                    return (
                      <Table.Row key={row.id}>
                        <Table.Cell className="tj-body1 text-gray-black px-[12px] py-[20px]">
                          {row.name}
                        </Table.Cell>
                        <Table.Cell className="tj-body1 text-gray-black px-[12px] py-[20px]">
                          {row.intro}
                        </Table.Cell>
                        <Table.Cell className="tj-body1 text-gray-black px-[12px] py-[20px]">
                          {row.phone}
                        </Table.Cell>
                        <Table.Cell className="text-left px-[12px] py-[20px]">
                          {isApproved ? (
                            <span className="inline-flex rounded-[20px] bg-blue-10 px-[10px] py-[6px] tj-body2-bold text-blue-20">
                              승인 완료
                            </span>
                          ) : isRejected ? (
                            <span className="inline-flex rounded-[20px] bg-red-10 px-[10px] py-[6px] tj-body2-bold text-red-40">
                              거절
                            </span>
                          ) : (
                            <div className="flex gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                size="medium"
                                btnColor="primary"
                                onClick={() => handleReject(row.id)}
                              >
                                거절하기
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="medium"
                                btnColor="blue"
                                onClick={() => handleApprove(row.id)}
                              >
                                승인하기
                              </Button>
                            </div>
                          )}
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                  {totalPages > 1 && (
                    <Table.Row className="border-b-0">
                      <Table.Cell colSpan={4} className="bg-white">
                        <div className="flex justify-center py-4">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            maxPageButtons={7}
                          />
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

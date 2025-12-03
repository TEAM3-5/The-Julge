'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import Button from '@/components/common/Button';
import { EmptySection } from '@/components/common/EmptySection';
import { Table } from '@/components/common/Table';
import { Pagination } from '@/components/pagination/Pagination';
import Path from '@/components/post/icon/PostPath';

import { getUser } from '@/api/users';
import { listApplicationsByUser } from '@/api/applications';
import { useAuth } from '@/contexts/AuthContext';

import type { UserDetailResponse } from '@/types/user';

/** 페이지당 보여줄 신청 내역 개수 */
const PAGE_SIZE = 5;

/** 신청 내역에서 쓸 상태 */
type ApplicationRowStatus = 'pending' | 'accepted' | 'rejected';

type ApplicationRow = {
  id: string;
  shopName: string;
  scheduleText: string;
  hourlyPay: number;
  status: ApplicationRowStatus;
};

// 유저 지원 목록 응답 타입
type UserApplicationsResponse = {
  offset: number;
  limit: number;
  count: number;
  hasNext: boolean;
  items?: {
    item: {
      id: string;
      status: 'pending' | 'accepted' | 'rejected' | 'canceled';
      createdAt: string;
      shop: {
        item: {
          id: string;
          name: string;
          category: string;
          address1: string;
          address2?: string | null;
          description?: string | null;
          imageUrl: string;
          originalHourlyPay: number;
        };
      };
      notice: {
        item: {
          id: string;
          hourlyPay: number;
          description: string;
          startsAt: string;
          workhour: number;
          closed: boolean;
        };
      };
    };
  }[];
};

// 화면 상태
type ViewMode = 'loading' | 'noProfile' | 'noApplications' | 'full' | 'error';

// ----- 타입 가드 ----- //

function isUserDetailResponse(data: unknown): data is UserDetailResponse {
  if (!data || typeof data !== 'object') return false;

  const obj = data as { item?: unknown };
  if (!obj.item || typeof obj.item !== 'object') return false;

  const item = obj.item as {
    id?: unknown;
    email?: unknown;
    type?: unknown;
  };

  const isString = (v: unknown): v is string => typeof v === 'string';

  if (!isString(item.id) || !isString(item.email)) return false;
  if (item.type !== 'employee' && item.type !== 'employer') return false;

  return true;
}

function isUserApplicationsResponse(data: unknown): data is UserApplicationsResponse {
  if (!data || typeof data !== 'object') return false;

  const obj = data as { items?: unknown };

  // items가 존재하지만 배열이 아니면 잘못된 응답
  if (obj.items && !Array.isArray(obj.items)) {
    return false;
  }

  // items가 배열이면 내부 구조 검사
  if (Array.isArray(obj.items)) {
    return obj.items.every((entry) => {
      if (!entry || typeof entry !== 'object') return false;
      const e = entry as { item?: unknown };
      if (!e.item || typeof e.item !== 'object') return false;

      const app = e.item as { id?: unknown; status?: unknown };
      return typeof app.id === 'string' && typeof app.status === 'string';
    });
  }

  // items가 없는 경우도 유효한 응답
  return true;
}

// ----- 헬퍼 함수 ----- //

function getErrorMessage(error: unknown, defaultMessage: string): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const e = error as { response?: { data?: { message?: string } } };
    return e.response?.data?.message ?? defaultMessage;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return defaultMessage;
}

// 2023-01-12 10:00 ~ 12:00 (2시간) 형태
function formatDateTimeRange(startsAt: string, workhour: number) {
  try {
    const start = new Date(startsAt);
    const yyyy = start.getFullYear();
    const mm = String(start.getMonth() + 1).padStart(2, '0');
    const dd = String(start.getDate()).padStart(2, '0');
    const hh = String(start.getHours()).padStart(2, '0');
    const min = String(start.getMinutes()).padStart(2, '0');

    const end = new Date(start.getTime() + workhour * 60 * 60 * 1000);
    const ehh = String(end.getHours()).padStart(2, '0');
    const emin = String(end.getMinutes()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd} ${hh}:${min} ~ ${ehh}:${emin} (${workhour}시간)`;
  } catch {
    return `${startsAt} (${workhour}시간)`;
  }
}

// 01012341234 → 010-1234-1234
// 010-1234-1234 → 그대로 유지
function formatPhoneNumber(raw: string) {
  const digits = raw.replace(/\D/g, '');

  // 010 으로 시작하는 11자리 휴대폰
  if (digits.length === 11 && digits.startsWith('010')) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  }

  // 10자리 일반 번호 등
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }

  // 형식 맞추기 어려우면 원본 유지
  return raw;
}

// ----- 페이지 컴포넌트 ----- //

export default function MemberProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  const userId = user?.id ? String(user.id) : '';

  const [viewMode, setViewMode] = useState<ViewMode>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [profileBio, setProfileBio] = useState('');

  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // ----- 데이터 로드 ----- //

  useEffect(() => {
    if (!userId) return;

    async function fetchData() {
      try {
        setViewMode('loading');
        setErrorMessage(null);

        const [userRes, appsRes] = await Promise.all([
          getUser(userId),
          listApplicationsByUser(userId),
        ]);

        const userData = userRes.data;
        if (!isUserDetailResponse(userData)) {
          throw new Error('예상치 못한 사용자 응답 형식입니다.');
        }

        const me = userData.item;

        const hasProfile =
          Boolean(me.name) || Boolean(me.phone) || Boolean(me.address) || Boolean(me.bio);

        setProfileName(me.name ?? '');
        setProfilePhone(me.phone ?? '');
        setProfileAddress(me.address ?? '');
        setProfileBio(me.bio ?? '');

        const appsData = appsRes.data;
        if (!isUserApplicationsResponse(appsData)) {
          throw new Error('예상치 못한 신청 내역 응답 형식입니다.');
        }

        const mapped: ApplicationRow[] =
          appsData.items
            // 취소된 신청(canceled)은 제외
            ?.filter((entry) => entry.item.status !== 'canceled')
            .map((entry) => {
              const app = entry.item;
              const shopItem = app.shop.item;
              const noticeItem = app.notice.item;

              const status = app.status as ApplicationRowStatus;

              return {
                id: app.id,
                shopName: shopItem.name,
                scheduleText: formatDateTimeRange(noticeItem.startsAt, noticeItem.workhour),
                hourlyPay: noticeItem.hourlyPay,
                status,
              };
            }) ?? [];

        setApplications(mapped);

        if (!hasProfile) {
          setViewMode('noProfile');
        } else if (mapped.length === 0) {
          setViewMode('noApplications');
        } else {
          setViewMode('full');
        }
      } catch (error: unknown) {
        const msg = getErrorMessage(error, '내 프로필 정보를 불러오는 중 오류가 발생했습니다.');
        setErrorMessage(msg);
        setViewMode('error');
      }
    }

    fetchData();
  }, [userId]);

  // ----- 페이지네이션 ----- //

  const totalPages = useMemo(() => {
    if (applications.length === 0) return 1;
    return Math.ceil(applications.length / PAGE_SIZE);
  }, [applications.length]);

  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return applications.slice(start, start + PAGE_SIZE);
  }, [applications, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // ----- 공통 프로필 카드 ----- //

  const ProfileCard = (
    <section className="py-15 px-6 w-full bg-white flex flex-col items-center">
      <div className="flex flex-col justify-between md:flex-row gap-y-6 gap-4 md:gap-20 w-full max-w-[964px]">
        <span className="tj-h1 text-black">내 프로필</span>

        <div className="flex flex-col w-full max-w-[768px] md:max-w-[665px] rounded-[12px] bg-red-10 p-8">
          <div className="relative flex justify-between items-start">
            <div className="flex flex-col max-w-[392px] gap-7">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <span className="tj-body1-bold text-primary">이름</span>
                  <p className="tj-h1 text-gray-black">{profileName || '이름 미등록'}</p>
                </div>

                {/* 전화번호 */}
                <div className="flex flex-row gap-1.5 items-center">
                  <Image src="/icons/icon-phone.svg" alt="전화 아이콘" width={20} height={20} />
                  <span className="tj-body1 text-gray-50">
                    {profilePhone ? formatPhoneNumber(profilePhone) : '연락처 미등록'}
                  </span>
                </div>

                {/* 선호 지역 */}
                <div className="flex flex-row gap-1.5 items-center">
                  <Path className="w-5 h-5 text-[#F48A71]" />
                  <span className="tj-body1 text-gray-50">
                    선호 지역: {profileAddress || '선호 지역 미등록'}
                  </span>
                </div>
              </div>

              <p className="tj-body1 text-black">{profileBio || '열심히 일하겠습니다'}</p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="medium"
              onClick={() => router.push('/member/profile/edit')}
              className="w-[169px] absolute right-0 top-0"
            >
              편집하기
            </Button>
          </div>
        </div>
      </div>
    </section>
  );

  // ----- 렌더링 분기 ----- //

  if (!userId) {
    return (
      <main className="w-full bg-white flex flex-col items-center">
        <section className="py-15 w-full max-w-[964px] flex flex-col">
          <span className="tj-h1 text-gray-black">내 프로필</span>
          <p className="mt-4 tj-body1 text-red-40">로그인 정보가 없습니다. 먼저 로그인해 주세요.</p>
        </section>
      </main>
    );
  }

  if (viewMode === 'loading') {
    return (
      <main className="w-full bg-white flex flex-col items-center">
        <section className="py-15 w-full max-w-[964px] flex flex-col">
          <span className="tj-h1 text-gray-black">내 프로필</span>
          <p className="mt-4 tj-body1 text-gray-50">내 프로필 정보를 불러오는 중입니다...</p>
        </section>
      </main>
    );
  }

  if (viewMode === 'error') {
    return (
      <main className="w-full bg-white flex flex-col items-center">
        <section className="py-15 w-full max-w-[964px] flex flex-col">
          <span className="tj-h1 text-gray-black">내 프로필</span>
          <p className="mt-4 tj-body1 text-red-40">
            {errorMessage ?? '내 프로필 정보를 불러오는 중 문제가 발생했습니다.'}
          </p>
        </section>
      </main>
    );
  }

  // 1) 프로필이 없는 상태
  if (viewMode === 'noProfile') {
    return (
      <main className="w-full bg-white flex flex-col items-center">
        <section className="py-15 w-full bg-white flex flex-col items-center">
          <div className="flex flex-col w-full max-w-[964px]">
            <EmptySection
              title="내 프로필"
              description="내 프로필을 등록하고 원하는 가게에 지원해 보세요."
              buttonLabel="내 프로필 등록하기"
              href="/member/profile/new"
            />
          </div>
        </section>
      </main>
    );
  }

  // 2) 프로필은 있는데 신청 공고가 없는 상태
  if (viewMode === 'noApplications') {
    return (
      <main className="w-full bg-white flex flex-col items-center">
        {/* 내 프로필 카드 섹션 */}
        {ProfileCard}

        {/* 신청 내역 없음 섹션 */}
        <section className="py-15 w-full flex flex-col items-center">
          <div className="flex flex-col gap-6 w-full max-w-[964px]">
            <EmptySection
              title="신청 내역"
              description="아직 신청 내역이 없어요."
              buttonLabel="공고 보러가기"
              href="/member/notice"
            />
          </div>
        </section>
      </main>
    );
  }

  // 3) 프로필도 있고 신청 공고도 있는 상태 (full)
  return (
    <main className="w-full bg-white flex flex-col items-center">
      {/* 내 프로필 카드 섹션 */}
      {ProfileCard}

      {/* 신청 내역 테이블 섹션 */}
      <section className="py-15 px-6 w-full flex flex-col items-center gap-8">
        <div className="flex flex-col gap-8 w-full max-w-[964px]">
          <span className="tj-h1 text-black">신청 내역</span>

          <Table>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell className="w-28 md:w-[228px] bg-red-10 px-[12px] py-[20px]">
                  가게
                </Table.HeaderCell>
                <Table.HeaderCell
                  hideBelow="sm"
                  className="w-[320px] bg-red-10 px-[12px] py-[20px]"
                >
                  일자
                </Table.HeaderCell>
                <Table.HeaderCell
                  hideBelow="md"
                  className="w-[160px] bg-red-10 px-[12px] py-[20px]"
                >
                  시급
                </Table.HeaderCell>
                <Table.HeaderCell className="text-left bg-red-10 px-[12px] py-[20px]">
                  상태
                </Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {pageRows.map((row) => {
                const isAccepted = row.status === 'accepted';
                const isRejected = row.status === 'rejected';

                return (
                  <Table.Row key={row.id}>
                    <Table.Cell className="tj-body1 text-gray-black px-[12px] py-[20px]">
                      {row.shopName}
                    </Table.Cell>
                    <Table.Cell
                      hideBelow="sm"
                      className="tj-body1 text-gray-black px-[12px] py-[20px]"
                    >
                      {row.scheduleText}
                    </Table.Cell>
                    <Table.Cell
                      hideBelow="md"
                      className="tj-body1 text-gray-black px-[12px] py-[20px]"
                    >
                      {row.hourlyPay.toLocaleString('ko-KR')}원
                    </Table.Cell>
                    <Table.Cell className="text-left px-[12px] py-[20px]">
                      {isAccepted ? (
                        <span className="inline-flex rounded-[20px] bg-blue-10 px-[10px] py-[6px] tj-body2-bold text-blue-20">
                          승인 완료
                        </span>
                      ) : isRejected ? (
                        <span className="inline-flex rounded-[20px] bg-red-10 px-[10px] py-[6px] tj-body2-bold text-red-40">
                          거절
                        </span>
                      ) : (
                        <span className="inline-flex rounded-[20px] bg-green-10 px-[10px] py-[6px] tj-body2-bold text-green-20">
                          대기중
                        </span>
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
      </section>
    </main>
  );
}

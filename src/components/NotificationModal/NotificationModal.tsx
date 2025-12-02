'use client';

import { useEffect, useState } from 'react';
import { listAlerts, deleteAlert } from '@/api/alerts';
import { useAuth } from '@/contexts/AuthContext';

// 타입 정의
type AlertResult = 'accepted' | 'rejected';

type AlertItem = {
    id: string;
    createdAt: string;
    result: AlertResult;
    read: boolean;
    shop: {
        item: {
            id: string;
            name: string;
        };
    };
    notice: {
        item: {
            id: string;
            startsAt: string;
            workhour: number;
        };
    };
};

// API 응답
type AlertsResponse = {
    offset: number;
    limit: number;
    count: number;
    hasNext: boolean;
    items: { item: AlertItem }[];
};

type NotificationModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

// 상대 시간 텍스트
function formatRelativeTime(isoString: string) {
    const created = new Date(isoString).getTime();
    const diffMs = Date.now() - created;
    const diffMin = Math.floor(diffMs / 1000 / 60);

    if (diffMin <= 0) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;

    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}시간 전`;

    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay}일 전`;
}

// "2025-09-21 15:00-18:00" 형태의 공고 시간 텍스트
function formatNoticeTime(startsAt: string, workhour: number) {
    const start = new Date(startsAt);
    const end = new Date(start.getTime() + workhour * 60 * 60 * 1000);

    const pad = (n: number) => String(n).padStart(2, '0');

    const y = start.getFullYear();
    const m = pad(start.getMonth() + 1);
    const d = pad(start.getDate());
    const sh = pad(start.getHours());
    const sm = pad(start.getMinutes());
    const eh = pad(end.getHours());
    const em = pad(end.getMinutes());

    return `${y}-${m}-${d} ${sh}:${sm}-${eh}:${em}`;
}

export function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
    // AuthContext에서 로그인 여부와 userId 가져오기
    const { isLoggedIn, user } = useAuth();
    const userId = user?.id;

    const [alerts, setAlerts] = useState<AlertItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // 모달이 열릴 때마다 알림 목록 조회
    useEffect(() => {
        // 모달이 닫혀있거나, 로그인 안 되어 있으면 API 호출 안 함
        if (!isOpen || !isLoggedIn || !userId) return;

        const fetchAlerts = async () => {
            setIsLoading(true);
            try {
                const res = await listAlerts(userId);
                const data = res.data as AlertsResponse;

                // API 명세: items: [{ item: { ... } }]
                const items = data.items.map((v) => v.item);
                setAlerts(items);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAlerts();
    }, [isOpen, isLoggedIn, userId]);

    // 로그인 안 되어 있거나 userId 없으면 표시 X
    if (!isOpen || !isLoggedIn || !userId) return null;

    const totalCount = alerts.length;

    return (
        // 임시 절대위치 -- 아이콘 아래 위치하게
        <div className="fixed z-[1000] flex items-start justify-center sm:justify-end w-full h-full
            sm:top-[62px] sm:right-[495px]
        ">

            <section
                className="
          relative z-[1001] flex h-full w-full flex-col bg-red-10 shadow-lg
          px-5 py-10 gap-4
          sm:h-auto sm:w-auto sm:rounded-[10px] sm:py-6
        "
            >
                <header className="flex items-center justify-between">
                    <h2 className="tj-h3 text-gray-black">알림 {totalCount}개</h2>
                    <button
                        type="button"
                        className="text-[24px]" // sm:hidden
                        aria-label="알림 창 닫기"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </header>

                {isLoading ? (
                    <p className="text-tj-body1 text-gray-40">알림을 불러오는 중입니다...</p>
                ) : alerts.length === 0 ? (
                    <p className="text-tj-body1 text-gray-40">새로운 알림이 없습니다.</p>
                ) : (
                    <div className="overflow-y-auto">
                        <ul className="flex flex-col gap-2">
                            {alerts.map((alert) => {
                                const { shop, notice, result, createdAt } = alert;
                                const timeText = formatNoticeTime(
                                    notice.item.startsAt,
                                    notice.item.workhour,
                                );

                                return (
                                    <li key={alert.id}>
                                        <div
                                            className={`
                                            flex w-full flex-col gap-1 rounded-[5px] border border-gray-20 px-3 py-4 bg-white
                                            sm:w-[368px]
                                        `}
                                        >

                                            <span
                                                className={`
                                            h-[5px] w-[5px] rounded-full
                                                ${result === 'accepted' ? 'bg-blue-20' : 'bg-red-40'}
                                            `}
                                            />
                                            <div>
                                                <p className="tj-body2 text-gray-black">
                                                    {shop.item.name}({timeText})
                                                    공고 지원이{' '}
                                                    <span className={result === 'accepted' ? 'text-blue-20' : 'text-red-40'}>
                                                        {result === 'accepted' ? '승인' : '거절'}
                                                    </span>
                                                    되었어요.
                                                </p>
                                            </div>

                                            <p className="tj-caption text-gray-40">
                                                {formatRelativeTime(createdAt)}
                                            </p>

                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </section>
        </div>
    );
}

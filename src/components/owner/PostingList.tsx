"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PostCard, type PostCardProps } from "@/components/post/postCard";

/**
 * PostingList가 받는 개별 공고 데이터 타입
 * PostingList가 필요한 정보만 받아옴
 */
export type PostingItem = Omit<
    PostCardProps,
    "className" | "thumbnailClassName" | "onClick"
> & {
    id: string | number;
};

export type PostingListProps = {
    heading?: string;
    posts: PostingItem[]; // 렌더링할 공고 카드 데이터 배열
    className?: string;
    // 카드를 클릭했을 때 공고 데이터를 넘겨주는 핸들러
    onCardClick?: (post: PostingItem) => void;
    initialCount?: number;  // 화면에 보여지는 공고 카드 수
    pageSize?: number;      // 한 번에 몇 개씩 더 로드할지
};

export function PostingList({
    heading = "내가 등록한 공고",
    posts,
    className,
    onCardClick,
    initialCount = 6,
    pageSize = 6
}: PostingListProps) {
    /**
     * 무한 스크롤에서 현재 화면에 몇 개까지 보여줄지 관리하는 상태
     * 초기값: initialCount
     * IntersectionObsever에 의해 pageSize만큼씩 증가
     */
    const [visibleCount, setVisibleCount] = useState(initialCount);

    /**
     * 스크롤이 실제로 발생하는 영역을 가리키는 ref
     * IntersectionObserver의 root로 사용됨
     * 이 div 기준으로 sentinel(loadMoreRef)이 화면에 들어왔는지 관찰
     */
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    /**
     * 공고 카드를 더 불러올 때 트리거하는 spentiel 요소 ref
     * 이 div가 스크롤 영역의 viewport에 들어오면 다음 페이지 데이터를 로드
     */
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const hasPosts = posts.length > 0;

    // 현재 visibleCount까지만 슬라이스해서 화면에 보여줄 공고 배열
    const visiblePosts = useMemo(
        () => posts.slice(0, visibleCount),
        [posts, visibleCount],
    );

    // 아직 더 보여줄 데이터가 남았는지 여부
    const hasMore = visibleCount < posts.length;

    /**
     * post나 initialCount가 바뀔 때마다 visibleCount를 초기화
     * 필터/정렬이 바뀌었을 때, 스크롤 상태를 리셋해주는 역할
     */
    // useEffect(() => {
    //     setVisibleCount(initialCount);
    // }, [posts, initialCount]);

    /**
     * IntersectionObsever를 이용한 무한 스크롤 핵심 로직
     * 1. root: scrollContainerRef (실제 스크롤이 발생하는 영역)
     * 2. target: loadMoreRef (리스트 제일 아래에 있는 sentinel div)
     * 3. target이 root의 viewport에 일정 비율(threshold) 이상 들어오면
     *    → visibleCount를 pageSize만큼 증가시켜 다음 카드들을 렌더링
     *
     * - hasMore가 false가 되면(모든 카드 로드 완료) observer 등록 X
     * - cleanup에서 observer.disconnect() 호출로 메모리 누수 방지
     */
    useEffect(() => {
        const root = scrollContainerRef.current;
        const target = loadMoreRef.current;

        // 스크롤 영역, sentinel, 더 불러올 데이터가 없으면 바로 종료
        if (!root || !target || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;

                // sentinel이 viewport에 보이지 않으면 아무 것도 하지 않음
                if (!entry.isIntersecting) return;

                // sentinel이 보이는 순간 다음 pageSize 만큼 카드 수 증가
                setVisibleCount((prev) =>
                    Math.min(prev + pageSize, posts.length),
                );
            },
            {
                root,   // 스크롤 기준이 되는 영역
                threshold: 0.1, // sentinel 요소가 10% 이상 보일 때 콜백 실행
            }
        );

        // sentinel 관찰 시작
        observer.observe(target);

        // 컴포넌트 unmount 시 / deps 변경 시 obsever 해제
        return () => observer.disconnect();
    }, [hasMore, pageSize, posts.length, visibleCount]);

    if (!hasPosts) return null;

    return (
        <section className={`flex flex-col gap-8 w-full ${className ?? ""}`}>
            <span className="tj-h1 text-gray-black">{heading}</span>

            <div ref={scrollContainerRef}
                className={`overflow-scroll max-h-[730px] overflow-y-auto [&::-webkit-scrollbar]:hidden`}
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}>
                <div className="grid grid-cols-3 gap-x-3.5 gap-y-8">
                    {visiblePosts.map((post) => (
                        <PostCard
                            key={post.id}             // React key
                            {...post}                 // id 포함 나머지 props
                            className="h-full"
                            onClick={() => onCardClick?.(post)}
                        />
                    ))}
                </div>

                {hasMore && <div ref={loadMoreRef} className="w-full h-8" />}
            </div>

        </section>
    );
}

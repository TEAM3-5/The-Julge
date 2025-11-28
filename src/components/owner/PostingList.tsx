"use client";

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
};

export function PostingList({
  heading = "내가 등록한 공고",
  posts,
  className,
  onCardClick,
}: PostingListProps) {
  const hasPosts = posts.length > 0;

  return (
    <section className={`flex flex-col gap-6 ${className ?? ""}`}>
      <h2 className="tj-h1 text-gray-black">{heading}</h2>

      {hasPosts ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard
              key={post.id}             // React key
              {...post}                 // id 포함 나머지 props
              className="h-full"
              thumbnailClassName="md:h-40"
              onClick={() => onCardClick?.(post)}
            />
          ))}
        </div>
      ) : (
        <p className="tj-body1 text-gray-60">등록된 공고가 없습니다.</p>
      )}
    </section>
  );
}

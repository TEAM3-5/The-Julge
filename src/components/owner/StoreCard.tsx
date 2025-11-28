"use client"

import Button from "@/components/e/Button";
import Image from "next/image";
import PostPath from "@/components/post/icon/PostPath";

export type StoreCardProps = {
    heading: string;            // 섹션 제목
    thumbnailUrl: string;       // 좌측 썸네일 이미지 URL
    storeLabel?: string;        // 가게 이름 위에 붙는 라벨
    name: string;               // 가게 이름
    locationText: string;       // 가게 위치
    description: string;        // 가게 소개 문구
    editHref: string;           // 편집하기 버튼 클릭시 이동할 경로
    createPostingHref: string;  // 공고 등록하기 버튼 클릭시 이동할 경로
};

export function StoreCard({
    heading,
    thumbnailUrl,
    storeLabel = "식당",
    name,
    locationText,
    description,
    editHref,
    createPostingHref,
}: StoreCardProps) {
    return (
        <section className="flex flex-col gap-6">
            <span className="tj-h1 text-black">{heading}</span>

            <div className="flex flex-row justify-between bg-red-10 rounded-[12px] p-6">
                <div className="relative overflow-hidden rounded-xl w-[539px] h-[308px]">
                    <Image
                        src={thumbnailUrl}
                        alt={name}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="flex flex-col justify-between pt-4 w-[346px]">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            <span className="tj-body1-bold text-primary">{storeLabel}</span>
                            <span className="tj-h1 text-gray-black">{name}</span>
                        </div>

                        <div className="flex flex-row items-center gap-1.5">
                            <PostPath className="w-5 h-5 text-[#F48A71]" />
                            <span className="tj-body1 text-gray-50">{locationText}</span>
                        </div>

                        <span className="tj-body1 text-black">{description}</span>
                    </div>

                    <div className="flex gap-2 justify-between">
                            <Button variant="outline" size="medium" href={editHref} className="flex-1">
                                편집하기
                            </Button>

                            <Button size="medium" href={createPostingHref} className="flex-1">
                                공고 등록하기
                            </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
"use client";

import { EmptySection } from "@/components/common/EmptySection";
import { PostingList } from "@/components/owner/PostingList";
import { ShopCard } from "@/components/owner/ShopCard";

// 가게/공고 등록 전/후 분기
// noShop: 가게 등록 전
// ShopNoPosting: 가게 등록 후/공고 등록 전 
// full: 가게 등록 후/공고 등록 후
const VIEW_MODE: "noShop" | "shopNoPosting" | "full" = "full";

export default function ShopDetailPage() {
    // 가게 등록 전
    if (VIEW_MODE === "noShop") {
        return (
            <EmptySection
                title="내 가게"
                description="내 가게를 소개하고 공고도 등록해 보세요."
                buttonLabel="가게 등록하기"
                href="/owner/shop/new"
            />
        );
    }

    // 가게 등록 후/공고 등록 전
    if (VIEW_MODE === "shopNoPosting") {
        return (
            <div>
                <EmptySection
                    title="등록한 공고"
                    description="공고를 등록해 보세요."
                    buttonLabel="공고 등록하기"
                    href="/owner/postings/new"
                />
            </div>
        );
    }

    // 가게 등록 후/공고 등록 후
    if (VIEW_MODE === "full") {
        <div>

        </div>
    }


}

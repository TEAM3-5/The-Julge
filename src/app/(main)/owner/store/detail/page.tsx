"use client";

import { EmptySection } from "@/components/e/EmptySection";
import { PostingList } from "@/components/owner/PostingList";
import { StoreCard } from "@/components/owner/StoreCard";

// 가게/공고 등록 전/후 분기
// noStore: 가게 등록 전
// storeNoPosting: 가게 등록 후/공고 등록 전 
// full: 가게 등록 후/공고 등록 후
const VIEW_MODE: "noStore" | "storeNoPosting" | "full" = "full";

export default function StoreDetailPage() {
    // 가게 등록 전
    if (VIEW_MODE === "noStore") {
        return (
            <EmptySection
                title="내 가게"
                description="내 가게를 소개하고 공고도 등록해 보세요."
                buttonLabel="가게 등록하기"
                href="/owner/store/new"
            />
        );
    }

    // 가게 등록 후/공고 등록 전
    if (VIEW_MODE === "storeNoPosting") {
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

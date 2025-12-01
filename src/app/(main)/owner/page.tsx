"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { EmptySection } from "@/components/common/EmptySection";
import { getUser } from "@/api/users";
import { useAuthStore } from "@/stores/auth";

import type { UserDetailResponse } from "@/types/user";
import type { Shop } from "@/types/shop";

type ViewState = "idle" | "loading" | "noShop" | "error";

function isUserDetailResponse(data: unknown): data is UserDetailResponse {
  if (!data || typeof data !== "object") return false;

  const obj = data as { item?: unknown };
  if (!obj.item || typeof obj.item !== "object") return false;

  const item = obj.item as {
    id?: unknown;
    email?: unknown;
    type?: unknown;
    shop?: { item?: unknown } | null;
  };

  const isString = (v: unknown) => typeof v === "string";

  return isString(item.id) && isString(item.email);
}

export default function OwnerPage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const userId = user?.id ?? "";

  const [viewState, setViewState] = useState<ViewState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function checkMyShop() {
      try {
        setViewState("loading");
        setErrorMessage(null);

        const userRes = await getUser(userId);
        const userData = userRes.data;

        if (!isUserDetailResponse(userData)) {
          throw new Error("예상치 못한 사용자 응답 형식입니다.");
        }

        const me = userData.item;
        const shopData = (me.shop?.item ?? null) as Shop | null;

        // 가게가 있으면 → 해당 가게 상세로 보내기
        if (shopData) {
          router.replace(`/owner/shops/${shopData.id}`);
          return;
        }

        // 가게가 없으면 → 가게 등록 화면
        setViewState("noShop");
      } catch (error: unknown) {
        console.error(error);
        let msg = "내 가게 정보를 확인하는 중 오류가 발생했습니다.";

        if (error && typeof error === "object" && "response" in error) {
          const e = error as { response?: { data?: { message?: string } } };
          msg = e.response?.data?.message ?? msg;
        } else if (error instanceof Error && error.message) {
          msg = error.message;
        }

        setErrorMessage(msg);
        setViewState("error");
      }
    }

    checkMyShop();
  }, [userId, router]);

  // 1) 로그인 안 된 경우
  if (!userId) {
    return (
      <main className="w-full bg-white flex flex-col items-center">
        <section className="py-15 w-full max-w-[964px] flex flex-col">
          <span className="tj-h1 text-gray-black">내 가게</span>
          <p className="mt-4 tj-body1 text-red-500">
            로그인 정보가 없습니다. 먼저 로그인해 주세요.
          </p>
        </section>
      </main>
    );
  }

  // 2) 로딩 중
  if (viewState === "idle" || viewState === "loading") {
    return (
      <main className="w-full bg-white flex flex-col items-center">
        <section className="py-15 w-full max-w-[964px] flex flex-col">
          <span className="tj-h1 text-gray-black">내 가게</span>
          <p className="mt-4 tj-body1 text-gray-50">
            내 가게 정보를 확인하는 중입니다...
          </p>
        </section>
      </main>
    );
  }

  // 3) 에러
  if (viewState === "error") {
    return (
      <main className="w-full bg-white flex flex-col items-center">
        <section className="py-15 w-full max-w-[964px] flex flex-col">
          <span className="tj-h1 text-gray-black">내 가게</span>
          <p className="mt-4 tj-body1 text-red-500">
            {errorMessage ?? "내 가게 정보를 확인하는 중 문제가 발생했습니다."}
          </p>
        </section>
      </main>
    );
  }

  // 4) 가게 없음 → 가게 등록 유도
  if (viewState === "noShop") {
    return (
      <main className="w-full bg-white flex flex-col items-center">
        <section className="py-15 w-full max-w-[964px] flex flex-col">
          <EmptySection
            title="내 가게"
            description="내 가게를 소개하고 공고도 등록해 보세요."
            buttonLabel="가게 등록하기"
            href="/owner/shops/[shopId]/new"
          />
        </section>
      </main>
    );
  }

  return null;
}

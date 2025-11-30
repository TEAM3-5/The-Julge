"use client";

import Button from "@/components/common/Button"

type EmptySectionProps = {
    title: string;          // 섹션 제목
    description: string;    // 카드 안 설명 문구
    buttonLabel: string;    // 버튼 문구
    href: string;           // 버튼 클릭 시 이동할 경로
    className?: string;     // 페이지 스타일 추가 용도 ClassName
};

export function EmptySection({
    title,
    description,
    buttonLabel,
    href,
    className,
}: EmptySectionProps) {

    return (
        <section className={`w-full max-w-[965px] h-[275px] mx-auto flex flex-col justify-between ${className ?? ""}`}>
            {/* 타이틀 */}
            <h1 className="tj-h1 text-gray-black">
                {title}
            </h1>

            {/* 내용/등록 버튼 박스 */}
            <div className="flex justify-center">
                <div
                    className="
                        w-full max-w-[965px]
                        rounded-3 border border-gray-20
                        px-6 py-15 rounded-[12px]
                        flex flex-col items-center justify-center gap-6
                    "
                >
                    {/* 내용 */}
                    <p className="tj-body1 text-center text-gray-black">
                        {description}
                    </p>

                    {/* 등록 버튼 */}
                    <Button size="large" href={href} className="w-[346px] h-[47px] px-0!">
                        {buttonLabel}
                    </Button>
                </div>
            </div>
        </section>
    )
}
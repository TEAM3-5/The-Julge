"use client";

import { useSearchParams } from "next/navigation";
import { Pagination } from "@/components/pagination/Pagination";

export default function JunyeolPage() {
    const searchParams = useSearchParams();
    const pageParam = searchParams.get("page");
    const rawPage = pageParam ? Number(pageParam) || 1 : 1;
    const totalPages = 21;
    const currentPage = Math.min(Math.max(rawPage, 1), totalPages);
    return (
        <div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                hrefBuilder={(p) => `?page=${p}`}
                maxPageButtons={7}
                mode="full"
            />
        </div>
    );
}
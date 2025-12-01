import type { MemberType } from "@/types/auth";
import type { Shop } from "@/types/shop";

export type UserDetail = {
  id: string;
  email: string;
  type: MemberType; // 'employee' | 'employer'
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
  shop?: {
    item: Shop;
  } | null;
};

export type UserDetailResponse = {
  item: UserDetail;
};
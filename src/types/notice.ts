export type NoticeShop = {
  id: string;
  name: string;
  category: string;
  address1: string;
  address2: string;
  address?: string;
  description: string;
  imageUrl: string;
  originalHourlyPay: number;
};

export type Notice = {
  id: string;
  hourlyPay: number;
  startsAt: string;
  workhour: number;
  description: string;
  closed: boolean;
  shop: {
    item: NoticeShop;
    href?: string;
  };
};

export type NoticeListItem = {
  item: Notice;
  links?: unknown[];
};

export type NoticeListResponse = {
  offset: number;
  limit: number;
  count: number;
  hasNext: boolean;
  address?: string[];
  keyword?: string;
  items: NoticeListItem[];
  links?: unknown[];
};

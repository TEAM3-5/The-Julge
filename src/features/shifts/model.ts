export type ShiftStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITING';

export type ShiftRow = {
  id: number;
  storeName: string;
  dateText: string;
  wageText: string;
  status: ShiftStatus;
};

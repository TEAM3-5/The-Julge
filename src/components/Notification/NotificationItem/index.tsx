import Image from "next/image";
import { formatCreatedTime, formatNoticeTime } from "@/utils/formatTime";
import { cn } from "@/utils";
import { UserAlertItem } from "../userAlerts";

const statusColor = {
  accepted: { bg: "bg-blue-20", text: "text-blue-20" },
  rejected: { bg: "bg-primary", text: "text-primary" },
};

interface NotificationItemProps {
  alert: UserAlertItem;
  onAlertRead: (alertId: string) => void;
}

const NotificationItem = ({ alert, onAlertRead }: NotificationItemProps) => {
  const shopName = alert.shop.item.name;
  const resultMsg = {
    accepted: "승인",
    rejected: "거절",
  };

  const createdTime = formatCreatedTime(alert.createdAt);
  const { startsAt, workhour } = alert.notice.item;
  const workTime = formatNoticeTime(startsAt, workhour);

  const handleReadBtnClick = () => {
    onAlertRead(alert.id);
  };

  return (
    <article
      className="bg-white rounded-10 border border-gray-20 shadow-sm p-12 mb-10"
    >
      <div className="flex items-center gap-10 mb-6">
        <span className={cn("h-6 w-6 rounded-full", statusColor[alert.result].bg)} />
        <span className="text-12-regular text-gray-40">{createdTime}</span>

        <button
          aria-label="알림 읽음 처리하기"
          className="ml-auto opacity-60 hover:opacity-100 transition"
          onClick={handleReadBtnClick}
        >
          <Image src="/icons/ic_check-square.svg" alt="읽음" width={16} height={16} />
        </button>
      </div>

      <p className="text-14-regular text-gray-90 leading-[20px]">
        {shopName} ({workTime}) 공고 지원이{" "}
        <span className={cn("text-14-bold", statusColor[alert.result].text)}>
          {resultMsg[alert.result]}
        </span>
        되었어요.
      </p>
    </article>
  );
};

export default NotificationItem;

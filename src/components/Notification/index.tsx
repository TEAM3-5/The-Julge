import Image from "next/image";
import NotificationItem from "./NotificationItem";
import LoadingSpinner from "../LoadingSpinner";
import { UserAlertItem } from "./userAlerts";
import { USER_ALERTS } from "./mockData";
import { useEffect, useState } from "react";

interface NotificationProps {
  userId: string;
  onClose: () => void;
}

const Notification = ({ userId, onClose }: NotificationProps) => {
  const [alerts, setAlerts] = useState<UserAlertItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAllRead = !isLoading && alerts.length === 0;
  const isUnread = !isLoading && alerts.length > 0;

  const getAlerts = async () => {
    try {
      const data = USER_ALERTS;
      const unreadAlerts = data.items.map((i) => i.item).filter((alert) => !alert.read);
      setAlerts(unreadAlerts);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlertRead = async (alertId: string) => {
    try {
      await getAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAlerts();
  }, []);

  return (
    <section
      aria-label="알림"
      className="
        relative flex flex-col gap-16 
        px-20 py-32 
        bg-[#F8F4F1]

        tablet:bg-white tablet:w-[368px] tablet:max-h-[480px] 
        tablet:rounded-10 tablet:border tablet:border-gray-30 
        tablet:shadow-[0_2px_8px_rgba(0,0,0,0.1)]
      "
    >
      <header className="relative mb-4">
        <h1 className="text-20-bold">알림</h1>

        {/* Tablet/Desktop 모드에서만 X 버튼 보여줌 */}
        <button
          aria-label="알림창 닫기"
          className="absolute right-0 top-0 hidden tablet:block"
          onClick={onClose}
        >
          <Image src="/icons/ic_close.svg" alt="닫기" width={22} height={22} />
        </button>
      </header>

      {/* 상태 문구 */}
      <h2 className="text-16-regular text-gray-50">
        {isLoading && <>Loading...</>}
        {isAllRead && <>모든 알림을 확인했어요</>}
        {isUnread && (
          <>
            <span className="text-16-bold text-black">{alerts.length}</span>개의 읽지 않은 알림이 있어요
          </>
        )}
      </h2>

      {/* 알림 리스트 */}
      <ul className="h-full overflow-y-auto pr-4">
        {isLoading && <LoadingSpinner />}
        {alerts.map((alert) => (
          <li key={alert.id}>
            <NotificationItem alert={alert} onAlertRead={handleAlertRead} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Notification;

"use client";

import UserCard from "./wedgits/UserCard";
import Notification from "./wedgits/Notification";
import { Session } from "next-auth";

export default function UserNotifications({ session }: { session: Session }) {
  // console.log("NEW SESSION FROM CARD:: ", session);
  const notifications = [];
  return (
    <div>
      <UserCard user={session.user} />
      {notifications.length > 0 && (
        <div>
          <Notification
            color="blue"
            message="تنويه: لديك ترخيص قارب علي الإنتهاء، يمكنك مراجعة تفاصيل الترخيص من هنا"
          />
          <Notification
            color="yellow"
            message="تنويه: صور بحقك إنذار إعلامي، يمكنك مراجعة تفاصيل الإنذار من هنا"
          />
        </div>
      )}
    </div>
  );
}

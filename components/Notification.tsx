"use client";

import {
  useInboxNotifications,
  useUnreadInboxNotificationsCount,
} from "@liveblocks/react/suspense";
import {
  InboxNotification,
  InboxNotificationList,
  LiveblocksUIConfig,
} from "@liveblocks/react-ui";
import Image from "next/image";
import { ReactNode } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Notifications = () => {
  // Fetch inbox notifications and unread count using Liveblocks hooks
  const { inboxNotifications } = useInboxNotifications();
  const { count } = useUnreadInboxNotificationsCount();

  // Filter to get only unread notifications
  const unreadNotifications = inboxNotifications.filter(
    (notification) => !notification.readAt // Filter unread notifications
  );

  return (
    <Popover>
      <PopoverTrigger className="relative flex size-10 items-center justify-center rounded-lg">
        <Image
          src="/assets/icons/bell.svg"
          alt="inbox"
          width={24}
          height={24}
        />
        {/* Display a dot if there are unread notifications */}
        {count > 0 && (
          <div className="absolute right-2 top-2 z-20 size-2 rounded-full bg-blue-500" />
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="shad-popover">
        {/* Configuration for displaying the notifications */}
        <LiveblocksUIConfig
          overrides={{
            // Customize the text for mention notifications
            INBOX_NOTIFICATION_TEXT_MENTION: (user: ReactNode) => {
              return <>{user} mentioned you</>;
            },
          }}
        >
          <InboxNotificationList>
            {/* Display a message if there are no unread notifications */}
            {unreadNotifications.length <= 0 && (
              <p className="py-2 text-center text-dark-500">
                No notifications yet
              </p>
            )}
            {/* Display unread notifications if available */}
            {unreadNotifications.length > 0 &&
              unreadNotifications.map((inboxNotification: any) => (
                <InboxNotification
                  key={inboxNotification.id}
                  inboxNotification={inboxNotification}
                  className="bg-dark-200 text-white"
                  href={`/documents/${inboxNotification.roomId}`}
                  showActions={false}
                  kinds={{
                    // Custom rendering for different types of notifications
                    thread: (props) => (
                      <InboxNotification.Thread
                        {...props}
                        showRoomName={false}
                        showActions={false}
                      />
                    ),
                    textMention: (props) => {
                      return (
                        <InboxNotification.TextMention
                          {...props}
                          showRoomName={false}
                        />
                      );
                    },
                    $documentAccess: (props) => {
                      const { title, avatar } =
                        props.inboxNotification.activities[0].data;

                      return (
                        <InboxNotification.Custom
                          {...props}
                          title={title}
                          aside={
                            <InboxNotification.Icon className="bg-transparent">
                              <Image
                                src={(avatar as string) || ""}
                                width={36}
                                height={36}
                                alt="avatar"
                                className="rounded-full"
                              />
                            </InboxNotification.Icon>
                          }
                        >
                          {props.children}
                        </InboxNotification.Custom>
                      );
                    },
                  }}
                />
              ))}
          </InboxNotificationList>
        </LiveblocksUIConfig>
      </PopoverContent>
    </Popover>
  );
};
export default Notifications;

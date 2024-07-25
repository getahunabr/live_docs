import { cn } from "@/lib/utils";
import { useIsThreadActive } from "@liveblocks/react-lexical";
import { Composer, Thread } from "@liveblocks/react-ui";
import { useThreads } from "@liveblocks/react/suspense";
import React from "react";

const ThreadWrapper = ({ thread }: ThreadWrapperProps) => {
  const isActive = useIsThreadActive(thread.id);

  return (
    <Thread
      thread={thread}
      // Check if the current thread is active
      data-state={isActive ? "active" : null}
      className={cn(
        "comment-thread border",
        // Apply styles if the thread is active
        isActive && "!border-blue-500 shadow-md",
        // Apply styles if the thread is resolved
        thread.resolved && "opacity-40"
      )}
    />
  );
};

const Comments = () => {
  // Fetch all threads
  const { threads } = useThreads();

  return (
    <div className="comments-container">
      {/* Input for writing new comments */}
      <Composer className="comment-composer" />

      {threads.map((thread) => (
        // Render each thread using ThreadWrapper
        <ThreadWrapper key={thread.id} thread={thread} />
      ))}
    </div>
  );
};

export default Comments;

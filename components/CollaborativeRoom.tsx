"use client";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import { Editor } from "@/components/editor/Editor";
import Header from "@/components/Header";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import ActiveCollaborators from "./ActiveCollaborators";
import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import Image from "next/image";
import { updateDocument } from "@/lib/actions/room.actions";
import Loader from "./Loader";
import ShareModal from "./ShareModal";

const CollaborativeRoom = ({
  roomId,
  roomMetadata,
  users,
  currentUserType,
}: CollaborativeRoomProps) => {
  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  // Ref for the container div
  const containerRef = useRef<HTMLDivElement>(null);

  // Ref for the input element
  const inputRef = useRef<HTMLDivElement>(null);

  // Function to handle updating the document title
  const updateTitleHandler = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Check if the Enter key is pressed
    if (e.key === "Enter") {
      setLoading(true);

      try {
        // Check if the title has changed
        if (documentTitle !== roomMetadata.title) {
          // Update the document title
          const updatedDocument = await updateDocument(roomId, documentTitle);

          if (updatedDocument) {
            // Exit editing mode
            setEditing(false);
          }
        }
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    }
  };
  // useEffect to handle clicks outside the input to exit editing mode
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        // Exit editing mode
        setEditing(false);
        // Update the document title
        updateDocument(roomId, documentTitle);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [roomId, documentTitle]);

  // useEffect to focus the input when entering editing mode
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus(); // Focus the input field
    }
  }, [editing]);

  return (
    // {/* Provide the room context for Liveblocks */}
    <RoomProvider id={roomId}>
      {/* Suspense for client-side data fetching */}
      <ClientSideSuspense fallback={<Loader />}>
        <div className="collaborative-room">
          <Header>
            <div
              ref={containerRef}
              className="flex w-fit items-center justify-center gap-2"
            >
              {editing && !loading ? (
                <Input
                  type="text"
                  value={documentTitle}
                  ref={inputRef}
                  placeholder="Enter title"
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  onKeyDown={updateTitleHandler}
                  disable={!editing}
                  className="document-title-input"
                />
              ) : (
                <>
                  <p className="document-title">{documentTitle}</p>
                </>
              )}

              {currentUserType === "editor" && !editing && (
                <Image
                  src="/assets/icons/edit.svg"
                  alt="edit"
                  width={24}
                  height={24}
                  onClick={() => setEditing(true)}
                  className="pointer"
                />
              )}

              {currentUserType !== "editor" && !editing && (
                <p className="view-only-tag">View only</p>
              )}

              {loading && <p className="text-sm text-gray-400">saving...</p>}
            </div>
            <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
              <ActiveCollaborators />

              <ShareModal
                roomId={roomId}
                collaborators={users}
                creatorId={roomMetadata.creatorId}
                currentUserType={currentUserType}
              />

              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </Header>
          <Editor roomId={roomId} currentUserType={currentUserType} />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default CollaborativeRoom;

"use server";
// Importing Clerk client for user management
import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";
// Importing Liveblocks service
import { liveblocks } from "../liveblocks";

// Function to get users from Clerk based on user IDs
export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
  try {
    const { data } = await clerkClient.users.getUserList({
      emailAddress: userIds, // Fetch users by email addresses
    });
    // Transform the user data to a simpler format
    const users = data.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      avatar: user.imageUrl,
    }));
    // Sort the users according to the order of userIds
    const sortedUsers = userIds.map((email) =>
      users.find((user) => user.email === email)
    );

    return parseStringify(sortedUsers);
  } catch (error) {
    console.log(`Error fetching users: ${error}`);
  }
};
// Function to get users associated with a specific document (room)
export const getDocumentUsers = async ({
  roomId,
  currentUser,
  text,
}: {
  roomId: string;
  currentUser: string;
  text: string;
}) => {
  try {
    // Fetch room data by room ID
    const room = await liveblocks.getRoom(roomId);
    // Get emails of users who have access to the room, excluding the current user
    const users = Object.keys(room.usersAccesses).filter(
      (email) => email !== currentUser
    );

    if (text.length) {
      const lowerCaseText = text.toLowerCase(); // Convert search text to lowercase

      // Filter users based on whether their email includes the search text
      const filteredUsers = users.filter((email: string) =>
        email.toLowerCase().includes(lowerCaseText)
      );

      return parseStringify(filteredUsers);
    }

    return parseStringify(users);
  } catch (error) {
    console.log(`Error fetching document users: ${error}`);
  }
};

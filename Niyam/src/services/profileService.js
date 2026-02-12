import { ref, get, set, update } from "firebase/database";
import { rtdb } from "../firebaseConfig";

const profileRef = (userId) => ref(rtdb, `users/${userId}/profile`);

export const getUserProfile = async (userId) => {
  if (!userId) {
    return null;
  }

  const snapshot = await get(profileRef(userId));
  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.val();
};

export const upsertUserProfile = async ({ userId, name, email, avatar, plan }) => {
  if (!userId) {
    throw new Error("Missing user ID");
  }

  const updates = {
    name,
    email,
    avatar,
    plan,
    updatedAt: Date.now(),
  };

  await update(profileRef(userId), updates);
};

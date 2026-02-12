import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { getUserProfile, upsertUserProfile } from "./profileService";

const defaultProfile = {
  plan: "Premium Member",
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAETCzEEEPSgRTQukA2sL2UFomfv5o7vJWJNNnt28fK35mkXdOiDC_u49ktBKoqrY2vhAlZ7N6XTkIhfDykbl5N7egAx_Vt_eVM9wz4oxd8USZmrpp8zbkkZCTwVz-cYWUiJRPGWOa7e1ymdF7j3m5betgew27GQGDD-oAQ16PW6FZa2HbyqjrBVbDBnCfOVMtnfPxQb_6NlESmHrdGwbqEyB8FQG5qLb50isu1Muy2sTcAi9wl_vPtCoZqqFEN1uQpSHYfD3H11k8T",
};

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Auth persistence setup failed", error);
});

const buildUserProfile = async (user) => {
  if (!user) {
    return null;
  }

  const fallbackName = user.email ? user.email.split("@")[0] : "User";
  const storedProfile = await getUserProfile(user.uid);

  return {
    id: user.uid,
    name: storedProfile?.name || user.displayName || fallbackName,
    email: storedProfile?.email || user.email,
    plan: storedProfile?.plan || defaultProfile.plan,
    avatar: storedProfile?.avatar || defaultProfile.avatar,
  };
};

export const observeAuthState = (callback) =>
  onAuthStateChanged(auth, async (user) => {
    const profile = await buildUserProfile(user);
    callback(profile);
  });

export const getCurrentUser = async () => buildUserProfile(auth.currentUser);

export const login = async ({ email, password }) => {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return await buildUserProfile(credential.user);
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

export const signup = async ({ name, email, password }) => {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(credential.user, { displayName: name });
    }
    await upsertUserProfile({
      userId: credential.user.uid,
      name: name || credential.user.displayName,
      email,
      avatar: defaultProfile.avatar,
      plan: "Starter",
    });
    return await buildUserProfile({
      ...credential.user,
      displayName: name || credential.user.displayName,
    });
  } catch (error) {
    console.error("Signup failed", error);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    await upsertUserProfile({
      userId: credential.user.uid,
      name: credential.user.displayName,
      email: credential.user.email,
      avatar: credential.user.photoURL || defaultProfile.avatar,
      plan: "Starter",
    });
    return await buildUserProfile(credential.user);
  } catch (error) {
    console.error("Google sign-in failed", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout failed", error);
    throw error;
  }
};

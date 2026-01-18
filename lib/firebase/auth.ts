import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, googleProvider } from "./config";

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);

  // Verify domain
  const email = result.user.email;
  if (!email?.endsWith("@meet365.net")) {
    await firebaseSignOut(auth);
    throw new Error("meet365.net 도메인 계정만 로그인할 수 있습니다.");
  }

  return result.user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

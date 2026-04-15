import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAY1cXfxvEH9hKpA28WaQO2NzaqTZ4mF0g",
  authDomain: "my-therapist-bb8fa.firebaseapp.com",
  projectId: "my-therapist-bb8fa",
  storageBucket: "my-therapist-bb8fa.firebasestorage.app",
  messagingSenderId: "466706329299",
  appId: "1:466706329299:web:4971469d7b6843619dae26",
  measurementId: "G-DHYZ2C65X8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export auth instance (used by React context or components)
export { auth };

// Auth helpers
export const registerUser = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);
export const loginUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);
export const logoutUser = () => signOut(auth);

// Firestore collections
export const usersCollection = collection(db, "users");
export const coursesCollection = collection(db, "courses");

// User role functions
export const setUserRole = (userId, role) =>
  setDoc(doc(db, "users", userId), { role }, { merge: true });
export const getUserRole = async (userId) => {
  const userDoc = await getDoc(doc(db, "users", userId));
  return userDoc.exists() ? userDoc.data().role : null;
};

// Course CRUD (keep for later if needed)
export const addCourse = (course) => addDoc(coursesCollection, course);
export const getCourses = async () => {
  const snapshot = await getDocs(coursesCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
export const updateCourse = (id, course) =>
  updateDoc(doc(db, "courses", id), course);
export const deleteCourse = (id) => deleteDoc(doc(db, "courses", id));

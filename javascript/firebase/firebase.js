import {
    getFirestore,
    getDocs,
    addDoc,
    updateDoc,
    collection,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
    getAuth,
    signInAnonymously,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

import firebaseConfig from "../keys/firebase.json" with { type: "json" };

/** @typedef {import('../@types/firebase').FirebaseManager} FirebaseManager */

/**
 * Creates and manages the connection to Firebase Firestore, including authentication.
 * @async
 * @returns {Promise<FirebaseManager>} Resolves with an object containing Firestore access methods and the authenticated user.
 */
export async function createFirebaseManager() {
    const firebaseApp = initializeApp(firebaseConfig);
    const loggedUser = await authenticate();
    const database = getFirestore();

    async function authenticate() {
        const auth = getAuth(firebaseApp);
        const userCredential = await signInAnonymously(auth);
        return userCredential.user;
    }

    async function get(collectionName) {
        const collectionRef = collection(database, collectionName);
        const snapshot = await getDocs(collectionRef);
        return snapshot.docs.map((doc) => doc.data());
    }

    async function set(collectionName, data, id) {
        const collectionRef = collection(database, collectionName);
        if (id) {
            const documentReference = doc(collectionRef, id);
            await updateDoc(documentReference, data);
        } else {
            await addDoc(collectionRef, data);
        }
    }

    return { get, set, loggedUser };
}

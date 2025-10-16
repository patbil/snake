import {
    getFirestore,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    collection,
    doc,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import {
    getAuth,
    signInAnonymously,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import firebaseConfig from "../keys/firebase.json" with { type: "json" };

/** @typedef {import('../@types/firebase.js').FirebaseManager} FirebaseManager */

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
        try {
            const auth = getAuth(firebaseApp);
            const userCredential = await signInAnonymously(auth);
            return userCredential.user;
        } catch (error) {
            throw new Error(`Firebase authentication error: ${error.message}`);
        }
    }

    async function getAll(collectionName) {
        try {
            const collectionRef = collection(database, collectionName);
            const snapshot = await getDocs(collectionRef);
            return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            throw new Error(
                `Failed to fetch collection ${collectionName}: ${error.message}`
            );
        }
    }

    async function get(collectionName, docId) {
        try {
            const collectionRef = collection(database, collectionName);
            const documentRef = doc(collectionRef, docId);
            const snapshot = await getDoc(documentRef);
            return snapshot.data();
        } catch (error) {
            throw new Error(`Failed to fetch document: ${error.message}`);
        }
    }

    async function set(collectionName, data, id) {
        try {
            const collectionRef = collection(database, collectionName);
            if (id) {
                const documentRef = doc(collectionRef, id);
                await updateDoc(documentRef, data);
            } else {
                await addDoc(collectionRef, data);
            }
        } catch (error) {
            throw new Error(`Failed to save data: ${error.message}`);
        }
    }

    return { getAll, get, set, loggedUser };
}

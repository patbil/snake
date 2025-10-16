import { withErrorHandling } from "../error/error-handling.js";
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

    const database = getFirestore(firebaseApp);
    const loggedUser = await withErrorHandling(authenticate, {
        errorMessage: "Firebase authentication error",
    })();

    async function authenticate() {
        const auth = getAuth(firebaseApp);
        const userCredential = await signInAnonymously(auth);
        return userCredential.user;
    }

    async function getAll(collectionName) {
        const collectionRef = collection(database, collectionName);
        const snapshot = await getDocs(collectionRef);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }

    async function get(collectionName, docId) {
        const collectionRef = collection(database, collectionName);
        const documentRef = doc(collectionRef, docId);
        const snapshot = await getDoc(documentRef);
        return snapshot.data();
    }

    async function set(collectionName, data, id) {
        const collectionRef = collection(database, collectionName);
        if (id) {
            const documentRef = doc(collectionRef, id);
            await updateDoc(documentRef, data);
        } else {
            await addDoc(collectionRef, data);
        }
    }

    return {
        getAll,
        get,
        set,
        loggedUser,
    };
}

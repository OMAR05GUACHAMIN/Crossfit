// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBBf6rhLTG9oaKa6DRpunrxL6zuvGV_Paw",
    authDomain: "react-firebase-tutorial-1f02f.firebaseapp.com",
    projectId: "react-firebase-tutorial-1f02f",
    storageBucket: "react-firebase-tutorial-1f02f.appspot.com",
    messagingSenderId: "111799856724",
    appId: "1:111799856724:web:8f2e285990c4a14ca5c7c1"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const uploadFile = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
};

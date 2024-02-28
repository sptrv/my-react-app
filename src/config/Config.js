import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDK8_Uy-CzuEgKpraIixD-5pPOePQq_7J0",
    authDomain: "my-react-app-a3d3d.firebaseapp.com",
    projectId: "my-react-app-a3d3d",
    storageBucket: "my-react-app-a3d3d.appspot.com",
    messagingSenderId: "509308850284",
    appId: "1:509308850284:web:b9a717bf60824e63964849",
    measurementId: "G-0BCLR1MLC8"
  };

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const fs = firebase.firestore();

export {auth,fs}
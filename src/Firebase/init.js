import firebase from 'firebase'
import firestore from 'firebase/firestore'

var firebaseConfig = {
    apiKey: "AIzaSyD6DTqWoEEanCsVlfKl2TxACzO_9qlYpTo",
    authDomain: "vue-firebase-e8e8e.firebaseapp.com",
    projectId: "vue-firebase-e8e8e",
    storageBucket: "vue-firebase-e8e8e.appspot.com",
    messagingSenderId: "650920250919",
    appId: "1:650920250919:web:ef7de8f4aa9e1e1c228802"
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const fireStore = app.firestore();

export default fireStore;
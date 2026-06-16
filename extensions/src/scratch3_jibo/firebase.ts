// import firebase from 'firebase/app';
import 'firebase/compat/database';
import firebase from 'firebase/compat/app';

const config = {
    apiKey: "AIzaSyBRRWCIBplurimT9S2h0ikia3zJtH8GGz4",
    authDomain: "jibobecoding.firebaseapp.com",
    databaseURL: "https://jibobecoding-default-rtdb.firebaseio.com",
    projectId: "jibobecoding",
    storageBucket: "jibobecoding.appspot.com",
    messagingSenderId: "190480712101",
    appId: "1:190480712101:web:d2177edff3db7b63f5284c",
    measurementId: "G-251EZ4YTJF",
};

firebase.initializeApp(config);

// reference to firebase db
var database = firebase.database();

export default database;

// export function writeData(path: string, jibo_msg: any): Promise<void> {
//     return database.ref(path).push({ ...jibo_msg })
//         .catch((error) => {
//             console.error('Error:', error);
//             throw error;
//         });
// }




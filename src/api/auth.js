// configuring authentication from firebase
import firestore from '@react-native-firebase/firestore';

// Async action to fetch data from backend
export const fetchUserData = async id => {
  try {
    const data = await firestore().collection('users').doc(id).get();
    const userData = data._data;
    return userData;
  } catch (err) {
    console.log(err);
  }
};

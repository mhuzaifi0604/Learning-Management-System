import axios from 'axios';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import firebaseConfig from './Configuration'; // Import firebaseConfig directly

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const api = axios.create();
  

api.interceptors.request.use(async (config) => {
  const user = firebase.auth().currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response.status === 401) {
    console.log('Authentication Failed');
  }
  return Promise.reject(error);
});

export default api;

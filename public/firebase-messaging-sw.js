/* public/firebase-messaging-sw.js */
importScripts('https://www.gstatic.com/firebasejs/10.6.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.6.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCWEQyShhjTCAbSv2wefIQh72eQ-7C5rW4',
  authDomain: 'tredia-fd1ce.firebaseapp.com',
  projectId: 'tredia-fd1ce',
  storageBucket: 'tredia-fd1ce.firebasestorage.app',
  messagingSenderId: '357309026852',
  appId: '1:357309026852:web:81ad04e3b6dbcd75e7beb1',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(({ notification }) => {
  self.registration.showNotification(notification.title, {
    body: notification.body,
    icon: '/tredia-logo.png',
  });
});

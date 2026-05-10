// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Configuración de Firebase - Guía Mundial 2026
const firebaseConfig = {
  apiKey: "AIzaSyDr21-1ZNVKrsYRGCTfT0sEGcBhPoASVIk",
  authDomain: "guia-mundial-2026-fes.firebaseapp.com",
  projectId: "guia-mundial-2026-fes",
  storageBucket: "guia-mundial-2026-fes.firebasestorage.app",
  messagingSenderId: "933027187306",
  appId: "1:933027187306:web:388e3c3cc295796d629813"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Mensaje en segundo plano:', payload);
  
  const notificationTitle = payload.notification?.title || "Nueva Alerta Mundial 2026";
  const notificationOptions = {
    body: payload.notification?.body || "Tienes una nueva actualización de seguridad.",
    icon: '/favicon.png',
    badge: '/favicon.png',
    tag: 'mundial-alert', // Agrupa notificaciones
    vibrate: [200, 100, 200],
    data: {
      url: self.location.origin, // Abre la app al hacer clic
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Al hacer clic en la notificación, abrir la app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Si ya hay una ventana abierta, enfocarla
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Si no, abrir una nueva
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

const CACHE_NAME = 'n-system-cache-v5';
const urlsToCache = [
  './index.html',
  './manifest.json',
  './logo.n.png' // تأكد من وجود ملف الصورة هذا في نفس المجلد
];

// تثبيت الـ Service Worker وحفظ الملفات الأساسية
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// التعامل مع الطلبات (تشغيل التطبيق بدون إنترنت)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا وجد الملف في الكاش، يعطيك إياه
        if (response) {
          return response;
        }
        // إذا لم يجده، يجلب الملف من الإنترنت
        return fetch(event.request).catch(() => {
          // في حال عدم وجود إنترنت وعدم وجود الملف في الكاش، يمكن إرجاع الصفحة الرئيسية كحل طوارئ
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});

// تحديث الكاش القديم
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

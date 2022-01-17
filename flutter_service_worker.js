'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "8565d5578c6601012dac41784569a1ca",
"assets/FontManifest.json": "36bd0942cf9c16a894efdc269b722eb4",
"assets/fonts/Licorice-Regular.ttf": "49d38b495124ad5adf0f21a91081dba3",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/fonts/Pushster-Regular.ttf": "c3191f3b933ae0bd46335e178744326e",
"assets/images/cutechef.jpg": "bf196c89b7225f9c55746f643e343412",
"assets/images/cutechef1.jpg": "b94d83a2b23e8bc335003c479efd4bc1",
"assets/images/food2.jpg": "068f082853c1b78aee3473859e71b77e",
"assets/images/food3.jpg": "b5690c544e9384ce9ac28bf7bc821c82",
"assets/images/food4.jpg": "8221835e1cfd4fc03b8956a002abb08a",
"assets/images/foodbackground.jpg": "1d16a2a0eb3482a678807d9e452e5839",
"assets/images/justblack.png": "ebd71399ca12de06692b731ef5d3d350",
"assets/images/justyellow.png": "9901e3319fbd058e20e66cad55f74913",
"assets/images/SpiceLogo1.jpg": "6b7b53aa9f31eaee49a1b720d41ed0d2",
"assets/images/SpiceLogo2.jpg": "2d9074344060c65d61ea9c338d912110",
"assets/images/SpiceLogo3.jpg": "18666a1cd9342b24a85c26ba80b0a08b",
"assets/images/SpiceLogotransparent.png": "4857e6cfde757f9fde7e40204e5d96bf",
"assets/images/SpiceLogotransparents.png": "508b43f6c1fe80b675fd3a699c9da7a5",
"assets/images/SpiceLogotransparenty.png": "a8729cebaa76a461882ef85cb3a08b7c",
"assets/NOTICES": "bc3bb61d3de54ee4c1f10c8f51cee806",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "b37ae0f14cbc958316fac4635383b6e8",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "5178af1d278432bec8fc830d50996d6f",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "aa1ec80f1b30a51d64c72f669c1326a7",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "24dee580d0daaec1a0ebc2ddcdd885b6",
"/": "24dee580d0daaec1a0ebc2ddcdd885b6",
"main.dart.js": "9282c78b8d6a3cbf77f73ff3bd73bd16",
"manifest.json": "8fa14143b3c4984083946b61ad954290",
"splash/img/dark-1x.png": "c769325205ae262a6ac0a282bf9052ed",
"splash/img/dark-2x.png": "2cb8f7109863cd86ac25885c57acfcc1",
"splash/img/dark-3x.png": "d69b6a5b7117c4f3860b933ef13772ec",
"splash/img/dark-4x.png": "cd3eec98451c32e12e4afff447b1c26f",
"splash/img/light-1x.png": "c769325205ae262a6ac0a282bf9052ed",
"splash/img/light-2x.png": "2cb8f7109863cd86ac25885c57acfcc1",
"splash/img/light-3x.png": "d69b6a5b7117c4f3860b933ef13772ec",
"splash/img/light-4x.png": "cd3eec98451c32e12e4afff447b1c26f",
"splash/style.css": "64227ec06c71fef909f75868ada72c30",
"version.json": "0d791f3e88a1e51447ea229855efdf3e"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}

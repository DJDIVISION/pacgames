const publicVapidKey = 'BLei-NwbbRtrn0qUWICUbxD2wdExl4ra67PPQX7ImPq107Rs76tDOwUjHoqbrYwI26FrsQgxQkv_DiN8zD9Lheo';


async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log("permission granted")
  } else {
    throw new Error('Permission not granted for Notification');
  }
}

async function subscribeUserToPush(userId) {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey) 
  });
  console.log(subscription)
  await fetch('https://pacgames-roulette-server.onrender.com/subscribe', {
    method: 'POST',
    body: JSON.stringify({ subscription, userId }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function initializePushNotifications(userId) {
  try {
    await requestNotificationPermission();
    await subscribeUserToPush(userId);
  } catch (error) {
    console.error('Failed to initialize push notifications:', error);
  }
}





const publicVapidKey = 'BL0whCjUesl6_AELHTwthVOaccDkAUYyH-f8nFTQ75BiHMlJpadQ2gsaGu0E0yfo5qEcIWpw5InkzmRwrpm7oyw';


async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('Notification permission granted.');
  } else {
    console.error('Notification permission denied.');
  }
}

async function subscribeUserToPush(email) {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });
  console.log(registration)
  console.log(subscription)
  await fetch('https://pacgames-roulette-server.onrender.com/subscribe', {
    method: 'POST',
    body: JSON.stringify({ subscription, email }),
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

export async function initializePushNotifications(email) {
  try {
    await requestNotificationPermission();
    await subscribeUserToPush(email);
  } catch (error) {
    console.error('Failed to initialize push notifications:', error);
  }
}
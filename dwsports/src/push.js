

const publicVapidKey = 'BOZwMhEq3agdeylLqybhzZvqGyILZzQabLuRvuE0uhUilpNxMh23xs09WTYEwHqr7ztSMwzluynjXVNP5GTj87w';


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
  console.log(email)
  await fetch('http://localhost:8080/subscribe', {
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
    console.log(email)
    await requestNotificationPermission();
    await subscribeUserToPush(email);
  } catch (error) {
    console.error('Failed to initialize push notifications:', error);
  }
}
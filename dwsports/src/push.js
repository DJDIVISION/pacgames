

const publicVapidKey = 'BL0whCjUesl6_AELHTwthVOaccDkAUYyH-f8nFTQ75BiHMlJpadQ2gsaGu0E0yfo5qEcIWpw5InkzmRwrpm7oyw';


async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Permission not granted for Notification');
  }
}

async function subscribeUserToPush(userId) {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });
  const subscriptionData = {userId}
  await fetch('https://tpv-2-0-server.vercel.app/api/subscribe', {
    method: 'POST',
    body: JSON.stringify({ subscription, userId }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  /* const parentDocRef = doc(db, 'registrations', "TIBÈRIC");
  const subcollectionRef = collection(parentDocRef, 'pushSubscriptions');
  try {
    
    await setDoc(doc(subcollectionRef), subscriptionData);
  } catch (e) {
    console.error('Error getting subcollection documents: ', e);
  } */
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
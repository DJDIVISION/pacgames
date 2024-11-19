const { Router } = require("express");
const router = Router();

const webpush = require("../webpush.jsx");
let pushSubscripton;

router.post("/subscription", async (req, res) => {
  pushSubscripton = req.body;
  console.log(pushSubscripton);

  // Server's Response
  res.status(200).json();
  const payload = JSON.stringify({
    title: "Hi there!",
    message: "Welcome to PacTON Gaming Zone"
  });
  try {
    await webpush.sendNotification(pushSubscripton, payload);
  } catch (error) {
    console.log(error);
  }
});

router.post("/new-message", async (req, res) => {
  const { message } = req.body;
  console.log("message", message)
  res.status(200).json();
  // Payload Notification
  const payload = JSON.stringify({
    title: "Hello Bitches!!!",
    message: message
  });
  console.log("payload", payload)
  try {
    await webpush.sendNotification(pushSubscripton, payload);
  } catch (error) {
    console.log(error);
  }
});

const subscriptions = {};

// Endpoint to subscribe to notifications
router.post('/subscribe', async (req, res) => {
  const { subscription, email } = req.body;
  console.log("subs", subscription)
  console.log("email", email)
  if (!subscriptions[email]) {
    subscriptions[email] = [];
  }
  subscriptions[email].push(subscription);
  res.status(201).json({});
  const payload = JSON.stringify({
    title: "Hi!",
    message: "Welcome to PacTON Gaming Zone"
  });
  try {
    await webpush.sendNotification(pushSubscripton, payload);
  } catch (error) {
    console.log(error);
  }
});

// Endpoint to send notifications to a specific user
router.post('/send-notification', (req, res) => {
  const { email, notificationPayload } = req.body;
  const payload = JSON.stringify(notificationPayload);

  if (subscriptions[email]) {
    Promise.all(subscriptions[email].map(sub => webPush.sendNotification(sub, payload)))
      .then(() => res.status(200).json({ message: 'Notification sent successfully.' }))
      .catch(err => {
        console.error('Error sending notification, reason: ', err);
        res.sendStatus(500);
      });
  } else {
    res.status(404).json({ message: 'No subscriptions found for this user.' });
  }
});

module.exports = router;
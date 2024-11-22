import React, { useEffect } from 'react';

const TelegramLogin = () => {
  useEffect(() => {
    // Load Telegram Widget Script
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;

    // Set widget attributes
    script.setAttribute('data-telegram-login', 'PactonGamingZoneBot'); // Replace with your bot's username
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute(
      'data-onauth',
      'onTelegramAuth(user)' // This will call your `onTelegramAuth` function
    );

    // Append script to the page
    document.body.appendChild(script);

    // Cleanup the script on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Define the onTelegramAuth function in global scope
  useEffect(() => {
    window.onTelegramAuth = (user) => {
      alert(
        `Logged in as ${user} ${user.last_name} (${user.id}${
          user.username ? `, @${user.username}` : ''
        })`
      );
    };
  }, []);

  return <div id="telegram-login"></div>; // This div is where Telegram renders the widget
};

export default TelegramLogin;

import React, { useEffect } from 'react';

const TelegramLogin = () => {
  useEffect(() => {
    // Ensure the script is loaded
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;

    // Configure widget attributes
    script.setAttribute('data-telegram-login', 'PactonGamingZoneBot'); // Your bot's username
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-userpic', 'true');
    script.setAttribute(
      'data-onauth',
      'onTelegramAuth(user)' // Register the callback
    );

    // Append the script specifically to the #telegram-login div
    const container = document.getElementById('telegram-login');
    if (container) {
      container.appendChild(script);
    }

    // Cleanup script on component unmount
    return () => {
      if (container) {
        container.innerHTML = ''; // Remove the widget content
      }
    };
  }, []);

  // Define the onTelegramAuth function globally
  useEffect(() => {
    window.onTelegramAuth = (user) => {
      alert(
        `Logged in as ${user.first_name} ${user.last_name} (${user.id}${
          user.username ? `, @${user.username}` : ''
        })`
      );
    };
  }, []);

  return (
    <div
      id="telegram-login"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%', // Adjust as needed
        width: '100%',
      }}
    ></div>
  );
};

export default TelegramLogin;

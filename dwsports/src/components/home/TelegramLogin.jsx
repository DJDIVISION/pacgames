import React, { useEffect } from 'react';

const TelegramLogin = () => {
  useEffect(() => {
    // Inject the Telegram widget script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', 'PactonGamingZoneBot'); // Your bot username
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth');
    script.setAttribute('data-request-access', 'write');
    document.getElementById('telegram-login-container').appendChild(script);

    // Define the onTelegramAuth function globally
    window.onTelegramAuth = (user) => {
      console.log('User Data:', user);
      // Replace alert with logic to send data to your backend
      alert(`Logged in as ${user.first_name} ${user.last_name} (${user.id}${user.username ? `, @${user.username}` : ''})`);
      
      // Example: Send user data to backend for processing
      fetch('https://pacgames-roulette-server.onrender.com/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Server response:', data);
        })
        .catch((err) => {
          console.error('Error sending data to backend:', err);
        });
    };

    return () => {
      document.getElementById('telegram-login-container').innerHTML = '';
    };
  }, []);

  return <div id="telegram-login-container"></div>;
};

export default TelegramLogin;

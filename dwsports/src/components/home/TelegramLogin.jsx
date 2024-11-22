import React, { useEffect } from 'react';

const TelegramLogin = ({ botName, onAuth }) => {
  useEffect(() => {
    // Load Telegram Widget script
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?7';
    script.async = true;
    script.onload = () => console.log('Telegram Widget Loaded');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Cleanup script on unmount
    };
  }, []);

  return (
    <div>
      <div
        id="telegram-login"
        data-telegram-login={botName}
        data-size="large"
        data-radius="10"
        data-auth-url="https://pactongamingzone.onrender.com"
        data-request-access="write"
        data-userpic="true"
      ></div>
    </div>
  );
};

export default TelegramLogin;

const webpush = require("web-push");

const vapidKeys = {
    publicKey: 'BLei-NwbbRtrn0qUWICUbxD2wdExl4ra67PPQX7ImPq107Rs76tDOwUjHoqbrYwI26FrsQgxQkv_DiN8zD9Lheo',
    privateKey: 'ybgqwG2c9lxh8AOmbu0hEgM2vcTWTDUf8Llxye81wmk'
  };
  
  webpush.setVapidDetails(
    'mailto:bodegaflamenca666@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );

module.exports = webpush;
import { toast } from 'react-toastify';

export const autoCloseOff = (message) => {
  toast(message, {
    className: "custom-toast",
    position: "top-right",
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
        });
};

export const placeBetNotify  = (message) => {
  toast(message, {
    className: "custom-toast",
    position: "top-right",
    autoClose: 15000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};

export const waitingtToStarttNotify  = (message) => {
    toast(message, {
      className: "custom-toast",
      position: "top-right",
      autoClose: 75000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
};

export const dismissAll = () =>  toast.dismiss();

export const welcomeNotify = (message) => {
    toast(message, {
      className: "custom-toast",
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
          });
};
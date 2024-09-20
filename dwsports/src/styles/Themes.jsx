import { fontFamily, fontSize, fontWeight } from "@mui/system";

export const lightTheme = {
    body: '#fff',
    text: '#202020', // black shade
    bodyRgba: '255, 255, 255',
    textRgba: '32,32,32',

    grey: '#bebebe',
    MainAccent: '#03e9f4',
    fontxs: '0.75em',
    fontsm: '0.875em',
    fontmd: '1em', // 1em = 16px
    fontlg: '1.25em',
    fontxl: '2em',
    fontxxl: '3em',
    fontxxxl: '5em',
    fontBig: '10em',

    navHeight: '5rem',
  };
  
  export const darkTheme = {
    body: '#202020',
    text: '#fff', // black shade
    bodyRgba: '32,32,32',
    textRgba: '255, 255, 255',
    pacBoxShadow: ' -11px 10px 15px -1px rgba(0,0,0,0.75)',
    pacman: {
      fontFamily: 'PacMan',
      fontWeight: 'bold',
      color: 'rgba(244,215,21,1)',
      textShadow:  '-3px 4px 1px #000000'
    },
    pacBorder: '2px solid rgba(244,215,21,1)',
    pacColor: 'rgba(244,215,21,1)',
    pacBlue: 'rgba(75,65,230,1)',
    pacfont: {
      fontFamily: 'PacFont',
      fontWeight: 'bold',
      color: 'rgba(244,215,21,1)',
      textShadow:  '-3px 4px 1px #000000'
    },
    grey: '#bebebe',
    MainAccent: '#03e9f4',
    fontxs: '0.75em',
    fontsm: '0.875em',
    fontmd: '1em', // 1em = 16px
    fontlg: '1.25em',
    fontxl: '2em',
    fontxxl: '3em',
    fontxxxl: '5em',
    fontBig: '10em',
  
    navHeight: '5rem',
  };

  export const themes = {
    light: lightTheme,
    dark: darkTheme,
}
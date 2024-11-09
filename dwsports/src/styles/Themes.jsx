import { fontFamily, fontSize, fontWeight } from "@mui/system";

export const lightTheme = {
    body: '#fff',
    text: '#202020',
    card: '#69e2f1', 
    copyIcon: '#202020',
    cardTwo: '#c0eaf0', // black shade
    bodyRgba: '255, 255, 255',
    textRgba: '32,32,32',
    pacColor: 'rgba(244,215,21,1)',
    textShadow:  '-1px 2px 2px #000000',
    textShadowTwo:  '0px 1px 1px #ffffff',
    darkBg: '#ffffff',
    grey: '#bebebe',
    MainAccent: '#96e6eb',
    MainShadow: '0 0 5px #acecf0, 0 0 25px #acecf0, 0 0 50px #acecf0, 0 0 100px #acecf0',
    fontxs: '0.75em',
    fontsm: '0.875em',
    fontmd: '1em', // 1em = 16px
    fontlg: '1.25em',
    fontxl: '2em',
    fontxxl: '3em',
    fontxxxl: '5em',
    fontBig: '10em',

    navHeight: '5rem',
    displayFlexCenter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    displayFlex: {
      display: 'flex',
      alignItems: 'center',
    },
    displayFlexColumn: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    displayFlexColumnCenter: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
  };
  
  export const darkTheme = {
    body: '#202020',
    text: '#fff', 
    darkBg: '#000000', 
    card: '#0f0d0d',
    copyIcon: 'aqua',
    cardTwo: '#302c2c',
    pacColor: 'rgba(244,215,21,1)',
    bodyRgba: '32,32,32',
    textRgba: '255, 255, 255',
    textShadow:  '0px 1px 1px #ffffff',
    textShadowTwo:  '0px 1px 1px #000000',
    MainShadow: '0 0 5px #03e9f4, 0 0 25px ${props => props.theme.text}, 0 0 50px #03e9f4, 0 0 100px #03e9f4',
    MainInnerShadow: `inset 0 0 10px ${props => props.theme.text}`,
    pacBoxShadow: ' -4px 5px 8px -1px rgba(255, 255, 255, 0.75)',
    dosisAqua: {
      fontFamily: 'Dosis',
      color: '#03e9f4',
      textShadow:  `-2px 2px 1px ${props => props.theme.text}`
    },
    dosisWhite: {
      fontFamily: 'Dosis',
      color: 'white',
      textShadow:  `-2px 2px 1px black`
    },
    pacman: {
      fontFamily: 'PacMan',
      fontWeight: 'bold',
      color: 'rgba(244,215,21,1)',
      textShadow:  '-3px 4px 1px #000000'
    },
    pacBorder: '2px solid rgba(244,215,21,1)',
    pacBlue: 'rgba(75,65,230,1)',
    pacfont: {
      fontFamily: 'PacFont',
      fontWeight: 'bold',
      color: 'rgba(244,215,21,1)',
      textShadow:  '-2px 2px 1px #000000'
    },
    pacfontBlue: {
      fontFamily: 'PacFont',
      fontWeight: 'bold',
      color: 'rgba(75,65,230,1)',
      textShadow:  '-2px 2px 1px #000000'
    },
    displayFlexCenter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    displayFlex: {
      display: 'flex',
      alignItems: 'center',
    },
    displayFlexColumn: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    displayFlexColumnCenter: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
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
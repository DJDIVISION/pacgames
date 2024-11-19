import React from 'react'
import { motion } from 'framer-motion'
import { pathVariants } from './index'
import styled, {useTheme} from 'styled-components'

const Hunny = () => {

    const theme = useTheme();

  return (
      <svg width="290" height="53" viewBox="0 0 290 53" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M267.376 50V51H268.376H273.624H274.624V50V31.9685L286.957 3.67963L287.567 2.28H286.04H280.728H280.062L279.805 2.89447L271 23.9685L262.195 2.89447L261.938 2.28H261.272H255.96H254.433L255.043 3.67963L267.376 31.9685V50Z" stroke={`${theme.MainAccent}`} stroke-width="2"/>
      <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M223.309 49.7593L223.002 51H224.28H229.528H230.324L230.503 50.2237L233.263 38.2H244.737L247.497 50.2237L247.676 51H248.472H253.72H254.998L254.691 49.7593L243.107 3.03934L242.918 2.28H242.136H235.864H235.082L234.893 3.03934L223.309 49.7593ZM239 13.2079L243.25 31.72H234.75L239 13.2079Z" stroke={`${theme.MainAccent}`} stroke-width="2"/>
      <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M195.12 50V51H196.12H219.8H220.8V50V45.392V44.392H219.8H202.368V3.28V2.28H201.368H196.12H195.12V3.28V50Z" stroke={`${theme.MainAccent}`} stroke-width="2"/>
      <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M163.643 2.42042L162.8 2.55451V3.408V50V51H163.8H169.048H170.048V50V34.9257C170.896 34.9753 171.779 35 172.696 35C176.652 35 179.919 34.4805 182.44 33.3805L182.447 33.3775L182.454 33.3744C185.015 32.2103 186.899 30.353 188.067 27.8281C189.217 25.3449 189.76 22.1561 189.76 18.32C189.76 14.4463 189.219 11.2539 188.066 8.80851C186.896 6.28449 185.011 4.44721 182.447 3.3265C179.922 2.18073 176.652 1.64 172.696 1.64C171.47 1.64 170.122 1.70542 168.654 1.83467C167.208 1.92291 165.536 2.11924 163.643 2.42042ZM170.492 28.269C170.346 28.2545 170.199 28.2387 170.048 28.2216V8.40125C170.15 8.39094 170.253 8.38116 170.355 8.37189L170.264 7.376L170.355 8.37189C171.262 8.2894 172.192 8.248 173.144 8.248C175.627 8.248 177.484 8.60246 178.787 9.23551L178.787 9.23556L178.797 9.24025C180.102 9.8563 181.04 10.841 181.63 12.2441L181.63 12.2441L181.634 12.2529C182.24 13.6543 182.576 15.6547 182.576 18.32C182.576 20.938 182.241 22.9448 181.63 24.3959C181.04 25.799 180.102 26.7837 178.797 27.3998L178.797 27.3997L178.787 27.4045C177.484 28.0375 175.627 28.392 173.144 28.392C172.191 28.392 171.307 28.3506 170.492 28.269Z" stroke={`${theme.MainAccent}`} stroke-width="2"/>
      <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M139.376 50V51H140.376H145.624H146.624V50V31.9685L158.957 3.67963L159.567 2.28H158.04H152.728H152.062L151.805 2.89447L143 23.9685L134.195 2.89447L133.938 2.28H133.272H127.96H126.433L127.043 3.67963L139.376 31.9685V50Z" stroke={`${theme.MainAccent}`} stroke-width="2"/>
      <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M97.52 50V51H98.52H103.64H104.64V50V16.0598L114.197 50.2691L114.401 51H115.16H123.48H124.48V50V3.28V2.28H123.48H118.36H117.36V3.28V37.2202L107.803 3.01094L107.599 2.28H106.84H98.52H97.52V3.28V50Z" stroke={`${theme.MainAccent}`} stroke-width="2"/>
      <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M65.52 50V51H66.52H71.64H72.64V50V16.0598L82.1969 50.2691L82.4011 51H83.16H91.48H92.48V50V3.28V2.28H91.48H86.36H85.36V3.28V37.2202L75.8031 3.01094L75.5989 2.28H74.84H66.52H65.52V3.28V50Z" stroke={`${theme.MainAccent}`} stroke-width="2"/>
      <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M36.7994 48.1889L36.8064 48.1964L36.8136 48.2038C39.1214 50.5596 42.5879 51.64 47 51.64C51.4492 51.64 54.9244 50.5621 57.1937 48.1962L57.1937 48.1963L57.2006 48.1889C59.4544 45.7913 60.48 42.163 60.48 37.52V3.28V2.28H59.48H54.36H53.36V3.28V37.008C53.36 40.1345 52.7883 42.1498 51.858 43.2868L51.8522 43.2939L51.8465 43.3011C51.0038 44.3707 49.4897 45.032 47 45.032C44.5629 45.032 43.0328 44.3755 42.142 43.2868C41.2117 42.1498 40.64 40.1345 40.64 37.008V3.28V2.28H39.64H34.52H33.52V3.28V37.52C33.52 42.163 34.5456 45.7913 36.7994 48.1889Z" stroke={`${theme.MainAccent}`} stroke-width="2"/>
      <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M1.52 50V51H2.52H7.64H8.64V50V28.6H21.36V50V51H22.36H27.48H28.48V50V3.28V2.28H27.48H22.36H21.36V3.28V21.992H8.64V3.28V2.28H7.64H2.52H1.52V3.28V50Z" stroke={`${theme.MainAccent}`} stroke-width="2"/>
      </svg>
  )
}

export default Hunny

import React from 'react'
import { motion } from 'framer-motion'
import { pathVariants } from './index'
import styled, {useTheme} from 'styled-components'

const Badger = () => {

    const theme = useTheme();

  return (
      <svg width="360" height="109" viewBox="0 0 360 109" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M320.001 105V106.5H321.501H338.205C344.633 106.5 349.665 104.813 352.955 101.136L352.955 101.136L352.961 101.129C356.214 97.4453 357.689 91.8445 357.689 84.648C357.689 77.0564 356.206 71.2536 352.88 67.636C349.554 63.9749 344.555 62.284 338.205 62.284H321.501H320.001V63.784V105ZM343.409 71.9031L343.415 71.9064L343.422 71.9096C344.811 72.6042 345.884 73.8272 346.588 75.7548C347.31 77.7313 347.713 80.6631 347.713 84.648C347.713 88.6265 347.268 91.5118 346.482 93.4209C345.703 95.311 344.603 96.4747 343.232 97.0992C341.685 97.7593 339.666 98.124 337.117 98.124H329.977V70.724H337.117C339.885 70.724 341.948 71.1547 343.409 71.9031Z" stroke={`${theme.MainAccent}`} stroke-width="3"/>
      <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M277.313 105V106.5H278.813H285.789H287.289V105V79.4412L306.005 105.867L306.454 106.5H307.229H313.373H314.873V105V63.784V62.284H313.373H306.461H304.961V63.784V89.4101L286.181 62.9165L285.733 62.284H284.957H278.813H277.313V63.784V105Z" stroke={`${theme.MainAccent}`} stroke-width="3"/>
      <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M231.384 104.465L230.606 106.5H232.785H240.017H241.046L241.416 105.54L245.142 95.876H259.659L263.385 105.54L263.755 106.5H264.785H271.953H274.125L273.355 104.469L257.739 63.2525L257.372 62.284H256.337H248.529H247.496L247.127 63.2487L231.384 104.465ZM247.375 87.5L252.369 74.3461L257.363 87.5H247.375Z" stroke={`${theme.MainAccent}`} stroke-width="3"/>
      <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M198.876 105V106.5H200.376H228.472H229.972V105V99.624V98.124H228.472H208.852V63.784V62.284H207.352H200.376H198.876V63.784V105Z" stroke={`${theme.MainAccent}`} stroke-width="3"/>
      <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M163.688 105V106.5H165.188H193.924H195.424V105V99.624V98.124H193.924H173.664V88.58H191.556H193.056V87.08V81.704V80.204H191.556H173.664V70.724H193.924H195.424V69.224V63.784V62.284H193.924H165.188H163.688V63.784V105Z" stroke={`${theme.MainAccent}`} stroke-width="3"/>
      <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M138.001 105V106.5H139.501H146.477H147.977V105V70.724H159.597H161.097V69.224V63.784V62.284H159.597H126.317H124.817V63.784V69.224V70.724H126.317H138.001V105Z" stroke={`${theme.MainAccent}`} stroke-width="3"/>
      <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M93.9917 103.592V104.588L94.9097 104.974C98.4064 106.447 102.916 107.14 108.356 107.14C113.959 107.14 118.422 106.098 121.489 103.761L121.495 103.757L121.501 103.752C124.581 101.356 126.112 98.0467 126.112 93.992C126.112 91.8388 125.691 89.8618 124.812 88.0951C123.934 86.198 122.404 84.639 120.357 83.38C118.33 82.0642 115.558 80.9937 112.122 80.1235C109.547 79.4478 107.557 78.845 106.133 78.3164C104.804 77.8074 104.072 77.2732 103.716 76.8151C103.373 76.3747 103.136 75.7237 103.136 74.728C103.136 73.8593 103.309 73.2325 103.573 72.7763C103.831 72.3313 104.228 71.9571 104.839 71.6669C106.257 70.9933 108.391 70.596 111.364 70.596C115.13 70.596 118.53 71.1892 121.581 72.3534L123.616 73.1299V70.952V64.808V63.7509L122.62 63.3954C121.3 62.9237 119.533 62.5224 117.363 62.1752C115.184 61.8196 112.863 61.644 110.404 61.644C105 61.644 100.666 62.6916 97.6455 65.0299C94.5991 67.3884 93.0957 70.6822 93.0957 74.728C93.0957 78.1437 94.088 81.0136 96.2231 83.1487L96.2295 83.155L96.2359 83.1614C98.313 85.189 101.739 86.7206 106.251 87.8919L106.26 87.8943L106.269 87.8965C109.013 88.5718 111.11 89.2131 112.592 89.8141L112.608 89.8207L112.625 89.8269C114.078 90.3766 114.929 90.9781 115.376 91.537C115.792 92.0559 116.072 92.8251 116.072 93.992C116.072 94.9713 115.894 95.6678 115.629 96.1576C115.375 96.6263 115.001 96.9826 114.447 97.2381L114.44 97.2412L114.434 97.2444C113.117 97.868 110.934 98.252 107.716 98.252C105.729 98.252 103.716 98.0494 101.677 97.6418C99.6566 97.2293 97.77 96.6952 96.0148 96.0422L93.9917 95.2894V97.448V103.592Z" stroke={`${theme.MainAccent}`} stroke-width="3"/>
      <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M51.946 104.465L51.1686 106.5H53.3473H60.5793H61.6086L61.9788 105.54L65.7046 95.876H80.2219L83.9477 105.54L84.318 106.5H85.3473H92.5153H94.6876L93.918 104.469L78.3019 63.2525L77.935 62.284H76.8992H69.0912H68.0585L67.69 63.2487L51.946 104.465ZM67.9372 87.5L72.9312 74.3461L77.9253 87.5H67.9372Z" stroke={`${theme.MainAccent}`} stroke-width="3"/>
      <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M11.9239 105.34L12.194 106.5H13.3848H20.3608H21.4728L21.796 105.436L29.0855 81.4392L35.9426 105.413L36.2537 106.5H37.3848H44.2328H45.4253L45.6942 105.338L55.2302 64.1221L55.6554 62.284H53.7688H46.9848H45.7904L45.5229 63.448L39.7284 88.6619L32.5558 63.3747L32.2465 62.284H31.1128H25.4168H23.9168V63.784V68.555L17.8169 88.8044L12.096 63.4538L11.832 62.284H10.6328H3.78476H1.89523L2.32386 64.1243L11.9239 105.34Z" stroke={`${theme.MainAccent}`} stroke-width="3"/>
      <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M255.97 45V46.5H257.47H264.445H265.945V45V31.908H272.19C273.713 31.908 274.4 32.1529 274.63 32.3216L274.649 32.3351L274.668 32.3481C275.031 32.5975 275.458 33.1055 275.864 34.0645L275.868 34.0737L275.872 34.0828L280.928 45.6028L281.322 46.5H282.302H289.47H291.754L290.846 44.4038L285.67 32.4549C285.224 31.3427 284.756 30.3929 284.254 29.6399C284.16 29.5001 284.062 29.3632 283.958 29.229C285.896 28.2942 287.494 26.9756 288.71 25.259C290.367 22.9195 291.161 20.1299 291.161 16.968C291.161 12.6544 290.023 9.06135 287.581 6.3695C285.096 3.53724 281.248 2.284 276.414 2.284H257.47H255.97V3.784V45ZM274.557 23.276H265.945V10.724H275.198C277.449 10.724 278.866 11.3034 279.735 12.2027C280.614 13.1114 281.185 14.6055 281.185 16.968C281.185 19.4555 280.528 20.9328 279.536 21.7787C278.434 22.7191 276.834 23.276 274.557 23.276Z" stroke={`${theme.MainAccent}`} stroke-width="3"/>
      <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M220.782 45V46.5H222.282H251.018H252.518V45V39.624V38.124H251.018H230.758V28.58H248.65H250.15V27.08V21.704V20.204H248.65H230.758V10.724H251.018H252.518V9.224V3.784V2.284H251.018H222.282H220.782V3.784V45Z" stroke={`${theme.MainAccent}`} stroke-width="3"/>
      <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M184.024 41.1577L184.03 41.1644C187.857 45.2281 193.433 47.14 200.482 47.14C204.355 47.14 207.619 46.7935 210.231 46.0602L210.24 46.0579L210.248 46.0554C212.785 45.3119 214.839 44.4737 216.335 43.5084L217.022 43.0653V42.248V22.408V20.908H215.522H199.266H197.766V22.408V26.952V28.452H199.266H208.07V37.3916C206.158 37.9507 203.707 38.252 200.674 38.252C196.274 38.252 193.322 37.0852 191.487 35.0387C189.602 32.9365 188.542 29.7462 188.542 25.224C188.542 20.194 189.556 16.5769 191.371 14.1648C193.102 11.92 196.232 10.596 201.25 10.596C205.366 10.596 209.071 11.2132 212.383 12.4247L214.398 13.162V11.016V5V3.92716L213.383 3.58048C211.545 2.95299 209.585 2.48581 207.505 2.17505C205.446 1.81826 203.167 1.644 200.674 1.644C195.798 1.644 191.634 2.57432 188.27 4.53633L188.27 4.5363L188.262 4.54097C184.957 6.49613 182.49 9.29642 180.875 12.8946C179.275 16.4169 178.502 20.5413 178.502 25.224C178.502 31.7755 180.292 37.1456 184.024 41.1577Z" stroke={`${theme.MainAccent}`} stroke-width="3"/>
      <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M138.219 45V46.5H139.719H156.423C162.852 46.5 167.884 44.8126 171.173 41.1362L171.173 41.1362L171.18 41.1289C174.433 37.4453 175.908 31.8445 175.908 24.648C175.908 17.0564 174.424 11.2536 171.099 7.63597C167.772 3.97491 162.774 2.284 156.423 2.284H139.719H138.219V3.784V45ZM161.628 11.9031L161.634 11.9064L161.641 11.9096C163.03 12.6042 164.102 13.8272 164.807 15.7548C165.529 17.7313 165.932 20.6632 165.932 24.648C165.932 28.6265 165.487 31.5118 164.7 33.4209C163.922 35.311 162.822 36.4747 161.451 37.0992C159.904 37.7593 157.885 38.124 155.335 38.124H148.195V10.724H155.335C158.104 10.724 160.167 11.1547 161.628 11.9031Z" stroke={`${theme.MainAccent}`} stroke-width="3"/>
      <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M92.2897 44.4647L91.5123 46.5H93.691H100.923H101.952L102.323 45.5396L106.048 35.876H120.566L124.291 45.5396L124.662 46.5H125.691H132.859H135.031L134.262 44.4685L118.646 3.25254L118.279 2.284H117.243H109.435H108.402L108.034 3.24874L92.2897 44.4647ZM108.281 27.5L113.275 14.3461L118.269 27.5H108.281Z" stroke={`${theme.MainAccent}`} stroke-width="3"/>
      <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M55.282 45V46.5H56.782H77.646C82.0355 46.5 85.617 45.4719 88.1282 43.1648C90.7192 40.8245 91.882 37.3654 91.882 33.096C91.882 30.1497 91.2539 27.6575 89.7497 25.8724C88.9623 24.8858 88.0142 24.0844 86.9213 23.4622C87.6107 22.8062 88.2122 22.0492 88.7242 21.1957L88.729 21.1878L88.7337 21.1798C89.7929 19.364 90.282 17.2112 90.282 14.792C90.282 11.0063 89.2119 7.86618 86.8869 5.59175C84.5323 3.2883 81.0478 2.284 76.75 2.284H56.782H55.282V3.784V45ZM79.6798 18.7666L79.6781 18.7684C79.1154 19.3801 77.969 19.884 75.79 19.884H65.258V10.532H75.022C77.76 10.532 79.1262 11.0731 79.6999 11.6708L79.7105 11.6818L79.7213 11.6927C80.3547 12.326 80.818 13.4451 80.818 15.368C80.818 16.9111 80.3954 17.9913 79.6798 18.7666ZM80.5743 29.1852L80.5955 29.2056L80.6175 29.2251C81.3405 29.8678 81.842 30.9642 81.842 32.84C81.842 35.2755 81.2952 36.5865 80.6058 37.2332C79.8504 37.8972 78.4796 38.38 76.174 38.38H65.258V28.004H75.47C78.3884 28.004 79.9114 28.5478 80.5743 29.1852Z" stroke={`${theme.MainAccent}`} stroke-width="3"/>
      </svg>
  )
}

export default Badger

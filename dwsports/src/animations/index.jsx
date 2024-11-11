import {motion} from 'framer-motion'

export const animationOne = {
    in: {
        opacity: 1,
        x: 0,
    },
    out: {
        opacity: 0,
        x: "-100vw",
    }
};

export const animationTwo = {
    in: {
        opacity: 1,
        x: 0
        
    },
    out: {
        opacity: 0,
        x: '100vw'
    }
};

export const animationThree = {
    in: {
        opacity: 1,
        x: -300
    },
    out: {
        opacity: 0,
        x: 300
    },
    end: {
        x: 0,
        opacity: 1
    }
};

export const animationFour = {
    in: {
        opacity: 1,
        scale: 1,
    },
    out: {
        opacity: 0,
        scale: 0,
    }
};

export const animationFive = {
    in: {
        opacity: 1,
    },
    out: {
        opacity: 0,
    }
};

export const transition = {
    duration: 0.3
};

export const transitionLong = {
    duration: 0.5,
    type: "tween"
}

export const TickAnimation = () => {
    return (
      <motion.svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        initial="hidden"
        animate="visible"
      >
        {/* Outer circle */}
        <motion.circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="#1aff22" // Green color for the circle
          strokeWidth="2"
          variants={{
            hidden: { pathLength: 0 },
            visible: {
              pathLength: 1,
              transition: {
                duration: 1,
                ease: "easeInOut"
              }
            }
          }}
        />
  
        {/* Checkmark path */}
        <motion.path
          d="M6 12l4 4 8-8" // Tick mark path
          fill="none"
          stroke="#1aff22" // Green color for the checkmark
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: { pathLength: 0 },
            visible: {
              pathLength: 1,
              transition: {
                duration: 0.5,
                delay: 1, // Delay after circle animation
                ease: "easeInOut"
              }
            }
          }}
        />
      </motion.svg>
    );
  };

export const CrossAnimation = () => {
    return (
      <motion.svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        initial="hidden"
        animate="visible"
      >
        {/* Outer circle */}
        <motion.circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="#F44336" // Red color for the circle
          strokeWidth="2"
          variants={{
            hidden: { pathLength: 0 },
            visible: {
              pathLength: 1,
              transition: {
                duration: 1,
                ease: "easeInOut"
              }
            }
          }}
        />
        
        {/* Cross paths */}
        <motion.line
          x1="6"
          y1="6"
          x2="18"
          y2="18"
          stroke="#F44336" // Red color for the cross
          strokeWidth="2"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0 },
            visible: {
              pathLength: 1,
              transition: {
                duration: 0.5,
                delay: 1, // Delay after circle animation
                ease: "easeInOut"
              }
            }
          }}
        />
        <motion.line
          x1="6"
          y1="18"
          x2="18"
          y2="6"
          stroke="#F44336" // Red color for the cross
          strokeWidth="2"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0 },
            visible: {
              pathLength: 1,
              transition: {
                duration: 0.5,
                delay: 1, // Delay after circle animation
                ease: "easeInOut"
              }
            }
          }}
        />
      </motion.svg>
    );
  };
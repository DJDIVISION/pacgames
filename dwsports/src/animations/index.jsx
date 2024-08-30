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

export const transition = {
    duration: 0.3
};

export const transitionLong = {
    duration: 0.5,
    type: "tween"
}
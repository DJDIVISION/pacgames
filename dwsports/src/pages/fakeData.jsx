

export const Zeroes = [
    {
        number: 0,
        color: "green",
        id: '0-single'
    },
    {
        number: "00",
        id: '0-double',
        color: "green",
        borderTopId : "borderTop-00",
        borderTop: [0,"00"],
    }
]

export const FirstRow = [
    {
        number: 0,
        color: "green"
    },
    {
        number: 3,
        cornerLeft: [0,"00",3,2,1],
        cornerLeftId : "corner-3",
        borderLeftId : "split-3",
        borderTopId : "borderTop-3",
        borderTop: [3,2,1],
        borderLeft: [0,3],
        color: "red"
    },
    {
        number: 6,
        cornerLeft: [1,2,3,4,5,6],
        cornerLeftId : "corner-6",
        borderLeftId : "split-6",
        borderTopId : "borderTop-6",
        borderLeft: [3,6],
        borderTop: [6,5,4],
        color: "black"
    },
    {
        number: 9,
        cornerLeft: [4,5,6,7,8,9],
        cornerLeftId : "corner-9",
        borderLeftId : "split-9",
        borderTopId : "borderTop-9",
        borderTop: [9,8,7],
        borderLeft: [9,6],
        color: "red"
    },
    {
        number: 12,
        cornerLeft: [7,8,9,10,11,12],
        cornerLeftId : "corner-12",
        borderLeftId : "split-12",
        borderTopId : "borderTop-12",
        borderTop: [12,11,10],
        borderLeft: [9,12],
        color: "red"
    },
    {
        number: 15,
        cornerLeft: [10,11,12,13,14,15],
        cornerLeftId : "corner-15",
        borderLeftId : "split-15",
        borderTopId : "borderTop-15",
        borderTop: [13,14,15],
        borderLeft: [12,15],
        color: "black"
    },
    {
        number: 18,
        cornerLeft: [13,14,15,16,17,18],
        cornerLeftId : "corner-18",
        borderLeftId : "split-18",
        borderTopId : "borderTop-18",
        borderTop: [16,17,18],
        borderLeft: [15,18],
        color: "red"
    },
    {
        number: 21,
        cornerLeft: [16,17,18,19,20,21],
        cornerLeftId : "corner-21",
        borderLeftId : "split-21",
        borderTopId : "borderTop-21",
        borderTop: [19,20,21],
        borderLeft: [18,21],
        color: "red"
    },
    {
        number: 24,
        cornerLeft: [19,20,21,22,23,24],
        cornerLeftId : "corner-24",
        borderLeftId : "split-24",
        borderTopId : "borderTop-24",
        borderTop: [22,23,24],
        borderLeft: [21,24],
        color: "black"
    },
    {
        number: 27,
        cornerLeft: [22,23,24,25,26,27],
        cornerLeftId : "corner-27",
        borderLeftId : "split-27",
        borderTopId : "borderTop-27",
        borderTop: [25,26,27],
        borderLeft: [24,27],
        color: "red"
    },
    {
        number: 30,
        cornerLeft: [25,26,27,28,29,30],
        cornerLeftId : "corner-30",
        borderLeftId : "split-30",
        borderTopId : "borderTop-30",
        borderTop: [28,29,30],
        borderLeft: [27,30],
        color: "red"
    },
    {
        number: 33,
        cornerLeft: [28,29,30,31,32,33],
        cornerLeftId : "corner-33",
        borderLeftId : "split-33",
        borderTopId : "borderTop-33",
        borderTop: [31,32,33],
        borderLeft: [30,33],
        color: "black"
    },
    {
        number: 36,
        cornerLeft: [31,32,33,34,35,36],
        cornerLeftId : "corner-36",
        borderLeftId : "split-36",
        borderTopId : "borderTop-36",
        borderTop: [34,35,36],
        borderLeft: [33,36],
        color: "red"
    }
]

export const FirstRowNoZeroes = [
    {
        number: 3,
        cornerLeft: [0,"00",3,2,1],
        cornerLeftId : "corner-3",
        borderLeftId : "split-3",
        borderTopId : "borderTop-3",
        borderTop: ["00",3],
        borderLeft: [3,2,1],
        color: "red"
    },
    {
        number: 6,
        cornerLeft: [1,2,3,4,5,6],
        cornerLeftId : "corner-6",
        borderLeftId : "split-6",
        borderTopId : "borderTop-6",
        borderLeft: [6,5,4],
        borderTop: [3,6],
        color: "black"
    },
    {
        number: 9,
        cornerLeft: [4,5,6,7,8,9],
        cornerLeftId : "corner-9",
        borderLeftId : "split-9",
        borderTopId : "borderTop-9",
        borderTop: [9,6],
        borderLeft: [9,8,7],
        color: "red"
    },
    {
        number: 12,
        cornerLeft: [7,8,9,10,11,12],
        cornerLeftId : "corner-12",
        borderLeftId : "split-12",
        borderTopId : "borderTop-12",
        borderTop: [9,12],
        borderLeft: [12,11,10],
        color: "red"
    },
    {
        number: 15,
        cornerLeft: [10,11,12,13,14,15],
        cornerLeftId : "corner-15",
        borderLeftId : "split-15",
        borderTopId : "borderTop-15",
        borderTop: [12,15],
        borderLeft: [13,14,15],
        color: "black"
    },
    {
        number: 18,
        cornerLeft: [13,14,15,16,17,18],
        cornerLeftId : "corner-18",
        borderLeftId : "split-18",
        borderTopId : "borderTop-18",
        borderTop: [15,18],
        borderLeft: [16,17,18],
        color: "red"
    },
    {
        number: 21,
        cornerLeft: [16,17,18,19,20,21],
        cornerLeftId : "corner-21",
        borderLeftId : "split-21",
        borderTopId : "borderTop-21",
        borderTop: [18,21],
        borderLeft: [19,20,21],
        color: "red"
    },
    {
        number: 24,
        cornerLeft: [19,20,21,22,23,24],
        cornerLeftId : "corner-24",
        borderLeftId : "split-24",
        borderTopId : "borderTop-24",
        borderTop: [21,24],
        borderLeft: [22,23,24],
        color: "black"
    },
    {
        number: 27,
        cornerLeft: [22,23,24,25,26,27],
        cornerLeftId : "corner-27",
        borderLeftId : "split-27",
        borderTopId : "borderTop-27",
        borderTop: [24,27],
        borderLeft: [25,26,27],
        color: "red"
    },
    {
        number: 30,
        cornerLeft: [25,26,27,28,29,30],
        cornerLeftId : "corner-30",
        borderLeftId : "split-30",
        borderTopId : "borderTop-30",
        borderTop: [27,30],
        borderLeft: [28,29,30],
        color: "red"
    },
    {
        number: 33,
        cornerLeft: [28,29,30,31,32,33],
        cornerLeftId : "corner-33",
        borderLeftId : "split-33",
        borderTopId : "borderTop-33",
        borderTop: [30,33],
        borderLeft: [31,32,33],
        color: "black"
    },
    {
        number: 36,
        cornerLeft: [31,32,33,34,35,36],
        cornerLeftId : "corner-36",
        borderLeftId : "split-36",
        borderTopId : "borderTop-36",
        borderTop: [33,36],
        borderLeft: [34,35,36],
        color: "red"
    }
]

export const SecondRow = [
    {
        number: "00",
        color: "green",
        borderTopId : "borderTop-00",
        borderTop: [0,"00"],
    },
    {
        number: 2,
        cornerLeft: [0,3,2],
        cornerLeftId : "corner-2",
        borderLeftId : "split-2",
        borderTopId : "borderTop-2",
        borderTop: [3,2],
        borderLeft: ["00",0,2],
        color: "black"
    },
    {
        number: 5,
        cornerLeft: [3,6,2,5],
        cornerLeftId : "corner-5",
        borderLeftId : "split-5",
        borderTopId : "borderTop-5",
        borderLeft: [2,5],
        borderTop: [6,5],
        color: "red"
    },
    {
        number: 8,
        cornerLeft: [6,9,5,8],
        cornerLeftId : "corner-8",
        borderLeftId : "split-8",
        borderTopId : "borderTop-8",
        borderTop: [9,8],
        borderLeft: [5,8],
        color: "black"
    },
    {
        number: 11,
        cornerLeft: [8,9,11,12],
        cornerLeftId : "corner-11",
        borderLeftId : "split-11",
        borderTopId : "borderTop-11",
        borderTop: [12,11],
        borderLeft: [11,8],
        color: "black"
    },
    {
        number: 14,
        cornerLeft: [11,12,14,15],
        cornerLeftId : "corner-14",
        borderLeftId : "split-14",
        borderTopId : "borderTop-14",
        borderTop: [14,15],
        borderLeft: [11,14],
        color: "red"
    },
    {
        number: 17,
        cornerLeft: [14,15,17,18],
        cornerLeftId : "corner-17",
        borderLeftId : "split-17",
        borderTopId : "borderTop-17",
        borderTop: [17,18],
        borderLeft: [14,17],
        color: "black"
    },
    {
        number: 20,
        cornerLeft: [17,18,20,21],
        cornerLeftId : "corner-20",
        borderLeftId : "split-20",
        borderTopId : "borderTop-20",
        borderTop: [20,21],
        borderLeft: [17,20],
        color: "black"
    },
    {
        number: 23,
        cornerLeft: [20,21,23,24],
        cornerLeftId : "corner-23",
        borderLeftId : "split-23",
        borderTopId : "borderTop-23",
        borderTop: [23,24],
        borderLeft: [20,23],
        color: "red"
    },
    {
        number: 26,
        cornerLeft: [23,24,26,27],
        cornerLeftId : "corner-26",
        borderLeftId : "split-26",
        borderTopId : "borderTop-26",
        borderTop: [26,27],
        borderLeft: [23,26],
        color: "black"
    },
    {
        number: 29,
        cornerLeft: [26,27,29,30],
        cornerLeftId : "corner-29",
        borderLeftId : "split-29",
        borderTopId : "borderTop-29",
        borderTop: [29,30],
        borderLeft: [26,29],
        color: "black"
    },
    {
        number: 32,
        cornerLeft: [29,30,32,33],
        cornerLeftId : "corner-32",
        borderLeftId : "split-32",
        borderTopId : "borderTop-32",
        borderTop: [32,33],
        borderLeft: [29,32],
        color: "red"
    },
    {
        number: 35,
        cornerLeft: [32,33,35,36],
        cornerLeftId : "corner-35",
        borderLeftId : "split-35",
        borderTopId : "borderTop-35",
        borderTop: [35,36],
        borderLeft: [32,35],
        color: "black"
    }
]

export const SecondRowNoZeroes = [
    
    {
        number: 2,
        cornerLeft: ["00",3,2],
        cornerLeftId : "corner-2",
        borderLeftId : "split-2",
        borderTopId : "borderTop-2",
        borderTop: ["00",0,2],
        borderLeft: [3,2],
        color: "black"
    },
    {
        number: 5,
        cornerLeft: [3,6,2,5],
        cornerLeftId : "corner-5",
        borderLeftId : "split-5",
        borderTopId : "borderTop-5",
        borderTop: [2,5],
        borderLeft: [6,5],
        color: "red"
    },
    {
        number: 8,
        cornerLeft: [6,9,5,8],
        cornerLeftId : "corner-8",
        borderLeftId : "split-8",
        borderTopId : "borderTop-8",
        borderTop: [5,8],
        borderLeft: [9,8],
        color: "black"
    },
    {
        number: 11,
        cornerLeft: [8,9,11,12],
        cornerLeftId : "corner-11",
        borderLeftId : "split-11",
        borderTopId : "borderTop-11",
        borderTop: [8,11],
        borderLeft: [11,12],
        color: "black"
    },
    {
        number: 14,
        cornerLeft: [11,12,14,15],
        cornerLeftId : "corner-14",
        borderLeftId : "split-14",
        borderTopId : "borderTop-14",
        borderTop: [14,11],
        borderLeft: [15,14],
        color: "red"
    },
    {
        number: 17,
        cornerLeft: [14,15,17,18],
        cornerLeftId : "corner-17",
        borderLeftId : "split-17",
        borderTopId : "borderTop-17",
        borderTop: [17,14],
        borderLeft: [18,17],
        color: "black"
    },
    {
        number: 20,
        cornerLeft: [17,18,20,21],
        cornerLeftId : "corner-20",
        borderLeftId : "split-20",
        borderTopId : "borderTop-20",
        borderTop: [20,17],
        borderLeft: [21,20],
        color: "black"
    },
    {
        number: 23,
        cornerLeft: [20,21,23,24],
        cornerLeftId : "corner-23",
        borderLeftId : "split-23",
        borderTopId : "borderTop-23",
        borderTop: [23,20],
        borderLeft: [24,23],
        color: "red"
    },
    {
        number: 26,
        cornerLeft: [23,24,26,27],
        cornerLeftId : "corner-26",
        borderLeftId : "split-26",
        borderTopId : "borderTop-26",
        borderTop: [26,23],
        borderLeft: [27,26],
        color: "black"
    },
    {
        number: 29,
        cornerLeft: [26,27,29,30],
        cornerLeftId : "corner-29",
        borderLeftId : "split-29",
        borderTopId : "borderTop-29",
        borderTop: [29,26],
        borderLeft: [30,29],
        color: "black"
    },
    {
        number: 32,
        cornerLeft: [29,30,32,33],
        cornerLeftId : "corner-32",
        borderLeftId : "split-32",
        borderTopId : "borderTop-32",
        borderTop: [32,29],
        borderLeft: [33,32],
        color: "red"
    },
    {
        number: 35,
        cornerLeft: [32,33,35,36],
        cornerLeftId : "corner-35",
        borderLeftId : "split-35",
        borderTopId : "borderTop-35",
        borderTop: [35,32],
        borderLeft: [36,35],
        color: "black"
    }
]

export const ThirdRow = [
    
    {
        number: 1,
        cornerLeft: [0,1,2],
        cornerLeftId : "corner-1",
        borderLeftId : "split-1",
        borderTopId : "borderTop-1",
        borderTop: [1,0],
        borderLeft: [2,1],
        color: "red"
    },
    {
        number: 4,
        cornerLeft: [1,2,4,5],
        cornerLeftId : "corner-4",
        borderLeftId : "split-4",
        borderTopId : "borderTop-4",
        borderLeft: [5,4],
        borderTop: [4,1],
        color: "black"
    },
    {
        number: 7,
        cornerLeft: [4,5,7,8],
        cornerLeftId : "corner-7",
        borderLeftId : "split-7",
        borderTopId : "borderTop-7",
        borderTop: [7,4],
        borderLeft: [8,7],
        color: "red"
    },
    {
        number: 10,
        cornerLeft: [7,8,10,11],
        cornerLeftId : "corner-10",
        borderLeftId : "split-10",
        borderTopId : "borderTop-10",
        borderTop: [10,7],
        borderLeft: [11,10],
        color: "black"
    },
    {
        number: 13,
        cornerLeft: [10,11,13,14],
        cornerLeftId : "corner-13",
        borderLeftId : "split-13",
        borderTopId : "borderTop-13",
        borderTop: [10,13],
        borderLeft: [14,13],
        color: "black"
    },
    {
        number: 16,
        cornerLeft: [13,14,16,17],
        cornerLeftId : "corner-16",
        borderLeftId : "split-16",
        borderTopId : "borderTop-16",
        borderTop: [16,13],
        borderLeft: [17,16],
        color: "red"
    },
    {
        number: 19,
        cornerLeft: [16,17,19,20],
        cornerLeftId : "corner-19",
        borderLeftId : "split-19",
        borderTopId : "borderTop-19",
        borderTop: [19,16],
        borderLeft: [20,19],
        color: "red"
    },
    {
        number: 22,
        cornerLeft: [19,20,22,23],
        cornerLeftId : "corner-22",
        borderLeftId : "split-22",
        borderTopId : "borderTop-22",
        borderTop: [22,19],
        borderLeft: [23,22],
        color: "black"
    },
    {
        number: 25,
        cornerLeft: [22,23,25,26],
        cornerLeftId : "corner-25",
        borderLeftId : "split-25",
        borderTopId : "borderTop-25",
        borderTop: [25,22],
        borderLeft: [26,25],
        color: "red"
    },
    {
        number: 28,
        cornerLeft: [25,26,28,29],
        cornerLeftId : "corner-28",
        borderLeftId : "split-28",
        borderTopId : "borderTop-28",
        borderTop: [28,25],
        borderLeft: [29,28],
        color: "black"
    },
    {
        number: 31,
        cornerLeft: [28,29,31,32],
        cornerLeftId : "corner-31",
        borderLeftId : "split-31",
        borderTopId : "borderTop-31",
        borderTop: [31,28],
        borderLeft: [32,31],
        color: "black"
    },
    {
        number: 34,
        cornerLeft: [31,32,34,35],
        cornerLeftId : "corner-34",
        borderLeftId : "split-34",
        borderTopId : "borderTop-34",
        borderTop: [34,31],
        borderLeft: [35,34],
        color: "red"
    }
]



export const LatestNumbers = [
    {
        number: 34,
        color: "red" 
    },
    {
        number: 22,
        color: "black"
    },
    {
        number: 23,
        color: "red"
    },
    {
        number: 0,
        color: "green"
    },
    {
        number: 18,
        color: "red"
    },
    {
        number: 17,
        color: "black"
    },
    {
        number: 3,
        color: "red"
    },
    {
        number: 27,
        color: "red"
    },
    {
        number: 3,
        color: "red"
    },
    {
        number: 34,
        color: "red"
    },
    {
        number: 20,
        color: "black"
    },
    {
        number: 19,
        color: "red"
    },
    {
        number: 11,
        color: "black"
    }
]

export const LastRow = [
    {
        name: "1-18",
        id: "first-18",
        numbers: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
        color: 'transparent'
    },
    {
        name: "EVEN",
        id: "EVEN",
        numbers: [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35],
        color: 'transparent'
    },
    {
        name: "",
        id: "reds",
        numbers: [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36],
        color: 'red'
    },
    {
        name: "",
        id: "blacks",
        numbers: [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35],
        color: 'black'
    },
    {
        name: "ODD",
        id: "ODD",
        numbers: [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36],
        color: 'transparent'
    },
    {
        name: "19-36",
        id: "last-18",
        numbers: [19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36],
        color: 'transparent'
    }
]

export const BetPerRows = [
    {
        name: "1st-12",
        numbers: [1,2,3,4,5,6,7,8,9,10,11,12]
    },
    {
        name: "2nd-12",
        numbers: [13,14,15,16,17,18,19,20,21,22,23,24]
    }
    ,
    {
        name: "3rd-12",
        numbers: [25,26,27,28,29,30,31,32,33,34,35,36]
    }
]

export const BetPerColumns = [
    {
        id: 'column-3',
        name: "2:1",
        numbers: [1,4,7,10,13,16,19,22,25,28,31,34]
    },
    {
        id: 'column-2',
        name: "2:1",
        numbers: [2,5,8,11,14,17,20,23,26,29,32,35]
    }
    ,
    {
        id: 'column-1',
        name: "2:1",
        numbers: [3,6,9,12,15,18,21,24,27,30,33,36]
    }
]

export const americanRouletteNumbers = [
    { number: 0, color: "lime" },
    { number: 28, color: "black" },
    { number: 9, color: "red" },
    { number: 26, color: "black" },
    { number: 30, color: "red" },
    { number: 11, color: "black" },
    { number: 7, color: "red" },
    { number: 20, color: "black" },
    { number: 32, color: "red" },
    { number: 17, color: "black" },
    { number: 5, color: "red" },
    { number: 22, color: "black" },
    { number: 34, color: "red" },
    { number: 15, color: "black" },
    { number: 3, color: "red" },
    { number: 24, color: "black" },
    { number: 36, color: "red" },
    { number: 13, color: "black" },
    { number: 1, color: "red" },
    { number: "00", color: "lime" },
    { number: 27, color: "red" },
    { number: 10, color: "black" },
    { number: 25, color: "red" },
    { number: 29, color: "black" },
    { number: 12, color: "red" },
    { number: 8, color: "black" },
    { number: 19, color: "red" },
    { number: 31, color: "black" },
    { number: 18, color: "red" },
    { number: 6, color: "black" },
    { number: 21, color: "red" },
    { number: 33, color: "black" },
    { number: 16, color: "red" },
    { number: 4, color: "black" },
    { number: 23, color: "red" },
    { number: 35, color: "black" },
    { number: 14, color: "red" },
    { number: 2, color: "black" },
  ];


export const PlayerDroppingAreas = [
    {
        id: 1,
        name: "player1"
    },
    {
        id: 2,
        name: "player2"
    },
    {
        id: 2,
        name: "player3"
    },
    {
        id: 4,
        name: "player4"
    },
    {
        id: 5,
        name: "player5"
    },
    {
        id: 6,
        name: "player6"
    },
    {
        id: 7,
        name: "player7"
    },
    {
        id: 8,
        name: "player8"
    },
    {
        id: 9,
        name: "player9"
    },
    {
        id: 10,
        name: "player10"
    },
    {
        id: 11,
        name: "player11"
    }
]














































export const players = [
    {
        name: "Mohamed Salah",
        nationality: "EGY",
        birth: "15 Jun 1992",
        position: "Forward",
        age: 32,
        player_id: 48,
        number: 11,
        foot: "Left",
        value: 53,
        photo: "https://media.api-sports.io/football/players/306.png",
        rating: 7.55,
        height: "175cm",
        goals: "2 ⚽",
        assists: "1 ↪️",
        scoringFreq: 87,
        shots: 3.5,
        targetShots: 2.5,
        available: "✅"
    },
    {
        name: "Darwin Núñez",
        nationality: "URU",
        birth: "24 Jun 1999",
        position: "Forward",
        age: 25,
        player_id: 49,
        number: 9,
        foot: "Right",
        value: 64,
        photo: "https://media.api-sports.io/football/players/51617.png",
        rating: 7.12,
        height: "188cm",
        available: "✅"
    },
    {
        name: "Luis Díaz",
        nationality: "COL",
        birth: "13 Jan 1997",
        position: "Forward",
        age: 27,
        player_id: 50,
        number: 7,
        foot: "Right",
        value: 81,
        photo: "https://media.api-sports.io/football/players/2489.png",
        rating: 7.23,
        height: "178cm",
        goals: "1 ⚽",
        assists: "1 ↪️",
        scoringFreq: 162,
        shots: 3,
        targetShots: 1.0,
        available: "✅"
    },
    {
        name: "Cody Gakpo",
        nationality: "NED",
        birth: "7 May 1999",
        position: "Forward",
        age: 25,
        player_id: 51,
        number: 18,
        foot: "Right",
        value: 53,
        photo: "https://media.api-sports.io/football/players/247.png",
        rating: 7.24,
        height: "193cm",
        shots: 0.5,
        yellow: "1 🟨",
        available: "✅"
    },
    {
        name: "Diogo Jota",
        nationality: "POR",
        birth: "4 Dec 1996",
        position: "Forward",
        age: 27,
        player_id: 52,
        number: 20,
        foot: "Right",
        value: 49,
        photo: "https://media.api-sports.io/football/players/2678.png",
        rating: 7.13,
        height: "178cm",
        goals: "1 ⚽",
        assists: "1 ↪️",
        scoringFreq: 151,
        shots: 3.5,
        targetShots: 0.5,
        available: "✅"
    },
    {
        name: "Alexis Mac Allister",
        nationality: "ARG",
        birth: "24 Dec 1998",
        position: "Midfielder",
        age: 25,
        player_id: 42,
        number: 10,
        foot: "Right",
        value: 82,
        photo: "https://media.api-sports.io/football/players/6716.png",
        rating: 7.19,
        height: "176cm",
        shots: 1,
        available: "✅"
    },
    {
        name: "Dominik Szoboszlai",
        nationality: "HUN",
        birth: "25 Oct 2000",
        position: "Midfielder",
        age: 23,
        player_id: 43,
        number: 8,
        foot: "Right",
        value: 68,
        photo: "https://media.api-sports.io/football/players/1096.png",
        rating: 7.32,
        height: "187cm",
        shots: 2.0,
        yellow: "1 🟨",
        available: "✅"
    },
    {
        name: "Harvey Elliott",
        nationality: "ENG",
        birth: "4 Apr 2003",
        position: "Midfielder",
        age: 21,
        player_id: 44,
        number: 19,
        foot: "Left",
        value: 36,
        photo: "https://media.api-sports.io/football/players/19035.png",
        rating: 7.40,
        height: "170cm",
        available: "✅"
    },
    {
        name: "Ryan Gravenberch",
        nationality: "NED",
        birth: "16 May 2002",
        position: "Midfielder",
        age: 22,
        player_id: 45,
        number: 38,
        foot: "Right",
        value: 38,
        photo: "https://media.api-sports.io/football/players/542.png",
        rating: 6.95,
        height: "190cm",
        yellow: "1 🟨",
        available: "✅"
    },
    {
        name: "Wataru Endo",
        nationality: "JPN",
        birth: "9 Feb 1993",
        position: "Midfielder",
        age: 31,
        player_id: 46,
        number: 3,
        foot: "Right",
        value: 11.9,
        photo: "https://media.api-sports.io/football/players/8500.png",
        rating: 6.91,
        height: "178cm",
        available: "✅"
    },
    {
        name: "Curtis Jones",
        nationality: "ENG",
        birth: "30 Jan 2001",
        position: "Midfielder",
        age: 23,
        player_id: 47,
        number: 17,
        foot: "Right",
        value: 33,
        photo: "https://media.api-sports.io/football/players/293.png",
        rating: 6.93,
        height: "185cm",
        available: "✅"
    },
    {
        name: "Trent Alexander-Arnold",
        nationality: "ENG",
        birth: "7 Oct 1998",
        position: "Defender",
        age: 25,
        player_id: 34,
        number: 66,
        foot: "Right",
        value: 72,
        photo: "https://media.api-sports.io/football/players/283.png",
        rating: 7.40,
        height: "180cm",
        shots: 1.5,
        available: "✅"
    },
    {
        name: "Virgil van Dijk",
        nationality: "NED",
        birth: "8 Jul 1991",
        position: "Defender",
        age: 33,
        player_id: 35,
        number: 4,
        foot: "Right",
        value: 31,
        photo: "https://media.api-sports.io/football/players/290.png",
        rating: 7.32,
        height: "193cm",
        shots: 0.5,
        targetShots: 0.5,
        available: "✅"
    },
    {
        name: "Andrew Robertson",
        nationality: "SCO",
        birth: "11 Mar 1994",
        position: "Defender",
        age: 30,
        player_id: 36,
        number: 26,
        foot: "Left",
        value: 32,
        photo: "https://media.api-sports.io/football/players/289.png",
        rating: 7.30,
        height: "178cm",
        shots: 1,
        targetShots: 1.0,
        available: "✅"
    },
    {
        name: "Ibrahima Konaté",
        nationality: "FRA",
        birth: "25 MAY 1999",
        position: "Defender",
        age: 30,
        player_id: 37,
        number: 5,
        foot: "Right",
        value: 46,
        photo: "https://media.api-sports.io/football/players/1145.png",
        rating: 7.30,
        height: "195cm",
        shots: 1,
        targetShots: 0.5,
        available: "✅"
    },
    {
        name: "Konstantinos Tsimikas",
        nationality: "GRE",
        birth: "12 May 1996",
        position: "Defender",
        age: 28,
        player_id: 38,
        number: 21,
        foot: "Left",
        value: 21,
        photo: "https://media.api-sports.io/football/players/1600.png",
        rating: 7.03,
        height: "178cm",
        available: "✅"
    },
    {
        name: "Joe Gomez",
        nationality: "ENG",
        birth: "23 May 1997",
        position: "Defender",
        age: 27,
        player_id: 39,
        number: 2,
        foot: "Right",
        value: 27,
        photo: "https://media.api-sports.io/football/players/284.png",
        rating: 6.92,
        height: "188cm",
        available: "✅"
    },
    {
        name: "Conor Bradley",
        nationality: "NIR",
        birth: "9 Jul 2003",
        position: "Defender",
        age: 21,
        player_id: 40,
        number: 84,
        foot: "Right",
        value: 16.5,
        photo: "https://media.api-sports.io/football/players/180317.png",
        rating: 7.15,
        height: "181cm",
        shots: 1,
        targetShots: 0.5,
        available: "✅"
    },
    {
        name: "Jarell Quansah",
        nationality: "ENG",
        birth: "29 Jan 2003",
        position: "Defender",
        age: 21,
        player_id: 41,
        number: 78,
        foot: "Right",
        value: 23,
        photo: "https://media.api-sports.io/football/players/158698.png",
        rating: 7.02,
        height: "190cm",
        available: "✅"
    },
    {
        name: "Caoimhin Kelleher",
        nationality: "IRL",
        birth: "23 Nov 1998",
        position: "Goalkeeper",
        age: 25,
        player_id: 32,
        number: 62,
        foot: "Right",
        value: 18,
        photo: "https://media.api-sports.io/football/players/281.png",
        rating: 7.05,
        height: "188cm",
        available: "✅"
    },
    {
        name: "Alisson",
        nationality: "BRA",
        birth: "2 Oct 1992",
        position: "Goalkeeper",
        age: 31,
        player_id: 33,
        number: 1,
        foot: "Right",
        value: 31,
        photo: "https://media.api-sports.io/football/players/280.png",
        rating: 7.06,
        height: "191cm",
        available: "✅"
    }
]
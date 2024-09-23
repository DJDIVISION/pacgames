import React, {useState,useCallback,useEffect} from 'react'
import { motion, useAnimation } from "framer-motion";
import { RouletteSection,RouletteColumn,RouletteContainer,BettingColumn,NumberCard,Wheel,Span,SpinButton,Number,NumberSpan,
    RouletteTableContainer,TableItem
 } from './indexTwo'
import { io } from "socket.io-client";
import {RouletteWrapper,Selector} from './indexTwo'
import { initWheel } from './functions';
import { Button } from '@mui/material';
import './styles.css'

const socket = io.connect("http://localhost:8080")

const americanRouletteNumbers = [
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

const tableNumbers = [
    { number: '0', color: 'lime' },
    { number: '00', color: 'lime' },
    { number: '1', color: 'red' },
    { number: '2', color: 'black' },
    { number: '3', color: 'red' },
    { number: '4', color: 'black' },
    { number: '5', color: 'red' },
    { number: '6', color: 'black' },
    { number: '7', color: 'red' },
    { number: '8', color: 'black' },
    { number: '9', color: 'red' },
    { number: '10', color: 'black' },
    { number: '11', color: 'black' },
    { number: '12', color: 'red' },
    { number: '13', color: 'black' },
    { number: '14', color: 'red' },
    { number: '15', color: 'black' },
    { number: '16', color: 'red' },
    { number: '17', color: 'black' },
    { number: '18', color: 'red' },
    { number: '19', color: 'red' },
    { number: '20', color: 'black' },
    { number: '21', color: 'red' },
    { number: '22', color: 'black' },
    { number: '23', color: 'red' },
    { number: '24', color: 'black' },
    { number: '25', color: 'red' },
    { number: '26', color: 'black' },
    { number: '27', color: 'red' },
    { number: '28', color: 'black' },
    { number: '29', color: 'black' },
    { number: '30', color: 'red' },
    { number: '31', color: 'black' },
    { number: '32', color: 'red' },
    { number: '33', color: 'black' },
    { number: '34', color: 'red' },
    { number: '35', color: 'black' },
    { number: '36', color: 'red' }
]

const Roulette = () => {

    const totalNumbers = americanRouletteNumbers.length;
    const degreesPerSegment = 360 / totalNumbers;
    const adjustmentRotation = degreesPerSegment * -2;
    const [rotationDegrees, setRotationDegrees] = useState(0);
    const [spinning, setSpinning] = useState(false);
    console.log(spinning)

    useEffect(() => {
        socket.on('winning-number', (winningNumber) => {
            console.log(winningNumber)
            const number = winningNumber.number 
            document.getElementById('counter').innerHTML = `Number should be ${number}`
            spinRoulette(winningNumber);
        });
        return () => {
            socket.off('winning-number');
        }
    }, []);

    const getRotationForNumber = (winningNumber) => {
        const targetIndex = americanRouletteNumbers.findIndex(num => num.number === winningNumber.number);
        const degreesPerNumber = 360 / totalNumbers;
        const targetRotation = targetIndex * degreesPerNumber;
        const fullRotations = 5 * 360; // 3 full spins
        const finalRotation = fullRotations + (360 - targetRotation);
        return finalRotation;
      };

    const spinRoulette = (winningNumber) => {
        setSpinning(true);
        console.log('Spin state', spinning);  // Debug log
        console.log(winningNumber)
    
        const finalRotation = getRotationForNumber(winningNumber);
        setRotationDegrees(finalRotation);
        console.log(finalRotation)
        // Reset spinning state after the spin duration
        setTimeout(() => {setSpinning(false);setRotationDegrees(0)}, 10000); // 10 seconds
      }; 

    const spinRequest = () => {
        socket.emit('spin-request');  
        console.log("spin requested!")
    }
  
    return (
        <RouletteSection>
            <RouletteColumn>
                <RouletteContainer>
                    <Wheel animate={{ rotate: rotationDegrees }} // Framer Motion animation
                            transition={{
                            duration: 10, // 10-second spin duration
                            ease: [0.22, 1, 0.36, 1], // easeOutCubic to slow down
                            }}>
                        < SpinButton />
                    {[...Array(19)].map((_, index) => (
                            <Span key={index} index={index} />
                        ))}
                        <Number>
                        {americanRouletteNumbers.map((item, index) => (
                            <NumberSpan key={index} index={index} style={{color: `${item.color}`, filter: `drop-shadow(0 0 10px aqua)`,
                            fontWeight: 'bold' }}>
                                {item.number}
                            </NumberSpan>
                            ))}
                        </Number>
                    </Wheel>
                </RouletteContainer>
            </RouletteColumn>
            <BettingColumn>
                <RouletteTableContainer>
                <div className="grid">
                    <div className="zero">0</div>
                    <div className="double-zero">00</div>
                    <div className="one-to-eigthteen">1 to 18</div>
                    <div className="nineteen-to-thirty-six">19 to 36</div>
                    <div className="even">EVEN</div>
                    <div className="first-twelve">1st 12</div>
                    <div className="second-twelve">2nd 12</div>
                    <div className="third-twelve">3rd 12</div>
                    <div className="two-to-one-first">2 to 1 f</div>
                    <div className="two-to-one-second">2 to 1 s</div>
                    <div className="two-to-one-third">2 to 1 t</div>
                    <div className="red-diamond">red-diamond</div>
                    <div className="black-diamond">black-diamond</div>
                    <div className="odd">ODD</div>
                    <div className="one">1</div>
                    <div className="two">2</div>
                    <div className="three">3</div>
                    <div className="four">4</div>
                    <div className="five">5</div>
                    <div className="six">6</div>
                    <div className="seven">7</div>
                    <div className="eight">8</div>
                    <div className="nine">9</div>
                    <div className="ten">10</div>
                    <div className="eleven">11</div>
                    <div className="twelve">12</div>
                    <div className="thirteen">13</div>
                    <div className="fourteen">14</div>
                    <div className="fifteen">15</div>
                    <div className="sixteen">16</div>
                    <div className="seventeen">17</div>
                    <div className="eighteen">18</div>
                    <div className="nineteen">19</div>
                    <div className="twenty">20</div>
                    <div className="twenty-one">21</div>
                    <div className="twenty-two">22</div>
                    <div className="twenty-three">23</div>
                    <div className="twenty-four">24</div>
                    <div className="twenty-five">25</div>
                    <div className="twenty-six">26</div>
                    <div className="twenty-seven">27</div>
                    <div className="twenty-eight">28</div>
                    <div className="twenty-nine">29</div>
                    <div className="thirty">30</div>
                    <div className="thirty-one">31</div>
                    <div className="thirty-two">32</div>
                    <div className="thirty-three">33</div>
                    <div className="thirty-four">34</div>
                    <div className="thirty-five">35</div>
                    <div className="thirty-six">36</div>
                </div>
                </RouletteTableContainer>
                {/* <div id="counter" style={{color: 'white', fontSize: '24px', margin: '30px 0'}}></div>
            <Button onClick={() => spinRequest()} variant="contained" disabled={spinning}>SPIN ROULETTE</Button> */}
            </BettingColumn>
      </RouletteSection>
    );
}

export default Roulette

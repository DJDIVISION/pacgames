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

const socket = io.connect("https://pacgames.onrender.com")

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
                
                </RouletteTableContainer>
                <div id="counter" style={{color: 'white', fontSize: '24px', margin: '30px 0'}}></div>
            <Button onClick={() => spinRequest()} variant="contained" disabled={spinning}>SPIN ROULETTE</Button>
            </BettingColumn>
      </RouletteSection>
    );
}

export default Roulette

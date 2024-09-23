import React, {useState,useRef, useEffect} from 'react'
import styled from 'styled-components'

import { Button } from '@mui/material';

const rouletteNumbers = [
    { number: 0, color: "green" },
    { number: 32, color: "red" },
    { number: 15, color: "black" },
    { number: 19, color: "red" },
    { number: 4, color: "black" },
    { number: 21, color: "red" },
    { number: 2, color: "black" },
    { number: 25, color: "red" },
    { number: 17, color: "black" },
    { number: 34, color: "red" },
    { number: 6, color: "black" },
    { number: 27, color: "red" },
    { number: 13, color: "black" },
    { number: 36, color: "red" },
    { number: 11, color: "black" },
    { number: 30, color: "red" },
    { number: 8, color: "black" },
    { number: 23, color: "red" },
    { number: 10, color: "black" },
    { number: 5, color: "red" },
    { number: 24, color: "black" },
    { number: 16, color: "red" },
    { number: 33, color: "black" },
    { number: 1, color: "red" },
    { number: 20, color: "black" },
    { number: 14, color: "red" },
    { number: 31, color: "black" },
    { number: 9, color: "red" },
    { number: 22, color: "black" },
    { number: 18, color: "red" },
    { number: 29, color: "black" },
    { number: 7, color: "red" },
    { number: 28, color: "black" },
    { number: 12, color: "red" },
    { number: 35, color: "black" },
    { number: 3, color: "red" },
    { number: 26, color: "black" },
    ];

const Wheel = ({isSpinning,setIsSpinning,updateNum}) => {

    const [spinAngleStart, setSpinAngleStart] = useState(Math.random() * 10 + 10)
    const [spinTimeTotal, setSpinTimeTotal] = useState(Math.random() * 3 + 4 * 1000)
    const [startAngle, setStartAngle] = useState(0)
    const [spinTime, setSpinTime] = useState(0)
    const [text, setText] = useState("")
    const [spinTimer, setSpinTimer] = useState(null)
    const [baseSize, setBaseSize] = useState(200)
    const [arc, setArc] = useState(Math.PI / (rouletteNumbers.length / 2))
    const canvasRef = useRef(null)

    const handleSpin = () => {
        setSpinTime(0)
        setSpinTimer(null)
        rotate();
    }

    const rotate = () => {
        if(spinTime > 2800){
            clearTimeout(spinTimer)
            stopRotateWheel();
        } else {
            const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
            setStartAngle(startAngle + spinAngle * Math.PI / 180)
            setSpinTime(spinTime + 10)
            drawRouletteWheel()
            clearTimeout(spinTimer);
            const timer = setTimeout(() => {
                rotate();
            }, 30)
            setSpinTimer(timer)
        }
    }

    const stopRotateWheel = () => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d');
        const degrees = startAngle * 180 / Math.PI + 90;
        const arcd = arc * 180 / Math.PI;
        const index = Math.floor((360 - degrees % 360) / arcd);
        ctx.save();
        const text = rouletteNumbers[index].number;
        setText(text)
        ctx.restore();
        updateNum(text);
    }

    const easeOut = (t, b, c, d) => {
        const ts = (t /= d) * t;
        const tc = ts * t;
        return b + c * (tc + -3 * ts + 3 * t);
    }
    
    const handleOnClick = () => {
        setIsSpinning(true) 
        handleSpin();
    }

    useEffect(() => {
        drawRouletteWheel()
    }, [])

    const drawRouletteWheel = () => {
        let ctx;
        const canvas = canvasRef.current
        console.log(canvas)
        if (canvas.getContext) {
            const outsideRadius = baseSize - 25;
            const textRadius = baseSize - 45;
            const insideRadius = baseSize - 85;
            const innderOutline = baseSize - 125;
            ctx = canvas.getContext('2d');
            // ctx.clearRect(0, 0, 400, 400);
      
            ctx.font = '14px Helvetica, Arial';
            for (let i = 0; i < rouletteNumbers.length; i++) {
              const angle = startAngle + i * arc;
              ctx.fillStyle = rouletteNumbers[i].color;
              ctx.beginPath();
              ctx.arc(baseSize, baseSize, outsideRadius, angle, angle + arc, false);
              ctx.arc(baseSize, baseSize, insideRadius, angle + arc, angle, true);
              ctx.fill();
              ctx.save();
              ctx.fillStyle = 'white';
              ctx.translate(baseSize + Math.cos(angle + arc / 2) * textRadius,
                baseSize + Math.sin(angle + arc / 2) * textRadius);
              ctx.rotate(angle + arc / 2 + Math.PI / 2);
              const text = rouletteNumbers[i].number;
              ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
              ctx.restore();
            }
            //Arrow
            ctx.strokeStyle = 'yellow'; //arrow
            ctx.lineWidth = 2; //arrow
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.lineTo(baseSize + 10, baseSize - (outsideRadius + 20));
            ctx.lineTo(baseSize + 0, baseSize - (outsideRadius - 5));
            ctx.lineTo(baseSize - 10, baseSize - (outsideRadius + 20));
            ctx.fill();
            ctx.stroke();
          }
    }

    

  return (
    <RouletteWrapper>
        <canvas ref={canvasRef} width={baseSize * 2} height={baseSize * 2} style={{margin: 0}}>

        </canvas>
        <Button onClick={handleOnClick} variant="contained">SPIN</Button>
    </RouletteWrapper>
  )
}

export default Wheel

import React, {useState,useEffect} from 'react'
import styled, {useTheme} from 'styled-components'
import { AbsoluteIconButtonLeft, BottomRow, IconHolder, item, TeamBetsHolder} from './indexThree'
import { LowRower, MiniRowerRow, Rower, RowerRow, SmallAvatar, SmallPlayerName, SmallRower, StyledButton } from '../components'
import { motion } from 'framer-motion'
import Select from '@mui/material/Select';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuItem from "@mui/material/MenuItem";
import axios from 'axios'
import Swal from "sweetalert2";
import { Avatar, CircularProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { transitionLong,animationFive } from '../animations';
import { FantasyState } from '../context/FantasyContext'
import { ArrowLeftRelative, SmallArrowDown, TeamLogoText, TeamLogoWrapper, TeamsLogo } from './index'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { useAuth } from './functions'
import { supabase } from '../supabase/client'
import black from '../assets/logos/black.jpg'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const CryptoPrediction = () => {

    
    const [crypto, setCrypto] = useState("the-open-network")
    const {balance, setBalance} = FantasyState();
    const [loading, setLoading] = useState(false)
    const [price, setPrice] = useState(null)
    const [currency, setCurrency] = useState("usd");
    const [symbol, setSymbol] = useState("$");
    const [logo, setLogo] = useState(null)
    const [name, setName] = useState(null)
    const [rank, setRank] = useState(null)
    const [change, setChange] = useState(null)
    const [historicData, setHistoricData] = useState();
    const [chartData, setChartData] = useState(null);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [openPlaceMenu, setOpenPlaceMenu] = useState(true);
    const [openPredictionsMenu, setOpenPredictionsMenu] = useState(false);
    const [openGoUpMenu, setOpenGoUpMenu] = useState(false);
    const [openGoDownMenu, setOpenGoDownMenu] = useState(false);
    const [chartOptions, setChartOptions] = useState({});
    const [timeRemainingMap, setTimeRemainingMap] = useState({});
    const [myPredictions, setMyPredictions] = useState([])
    const [days, setDays] = useState(1);
    const [flag,setflag] = useState(false);
    const [amount, setAmount] = useState(null)
    const theme = useTheme();
    const navigate = useNavigate()
    const {user} = useAuth();
    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        // Function to calculate remaining time for all predictions
        const calculateTimeRemaining = () => {
          const now = Date.now();
          const updatedTimes = {};
    
          myPredictions.forEach((pred) => {
            const targetTime = pred.date + 24 * 60 * 60 * 1000; // 24 hours in ms
            updatedTimes[pred.date] = Math.max(targetTime - now, 0); // Avoid negative times
          });
    
          setTimeRemainingMap(updatedTimes);
        };
    
        // Initial calculation
        calculateTimeRemaining();
    
        // Update countdown every second
        const interval = setInterval(() => {
          calculateTimeRemaining();
        }, 1000);
    
        return () => clearInterval(interval); // Cleanup on unmount
      }, [myPredictions]);

      const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
    
        return `${hours}h ${minutes}m ${seconds}s`;
      };

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
      };

    const darkTheme = createTheme({
        palette: {
          mode: 'dark',
        },
      });

    useEffect(() => {
        if (currency === "usd") setSymbol("$");
        else if (currency === "inr") setSymbol("₹");
        else if (currency === "eur") setSymbol("€");
        else if (currency === "gbp") setSymbol("£");
    }, [currency]);

    const fetchCrypto = () => {
        setLoading(true)
        const options = {
        method: 'GET',
        headers: {accept: 'application/json', 'x-cg-demo-api-key': 'CG-3qkmGTgTWXenAouD9JshQYt6'}
      };
      
      fetch(`https://api.coingecko.com/api/v3/coins/${crypto}`, options)
        .then(res => res.json())
        .then(res => {
            console.log(res)
            setLogo(res.image.small)
            setRank(res.market_cap_rank)
            setName(res.name)
            setChange(parseFloat(res.market_data.price_change_percentage_24h).toFixed(3))
            setPrice(res.market_data.current_price[currency])
        })
        .catch(err => console.error(err));
    }


    useEffect(() => {
        if(crypto && currency && days){
            fetchCrypto()
            fetchHistoricData()
        }
    }, [crypto,currency,days])


    const fetchHistoricData = async () => {
        try {
            const response = await fetch(
              `https://temp-server-pi.vercel.app/api/cryptocurrency/${crypto}/chart?days=${days}&currency=${currency}`
              /* `http://localhost:8080/api/cryptocurrency/${crypto}/chart?days=${days}&currency=${currency}` */
            );
            const data = await response.json();
    
            // Extract dates and prices
            const dates = data.prices.map(price => new Date(price[0]).toLocaleDateString());
            const prices = data.prices.map(price => price[1]);
            console.log(dates)
            console.log(prices)
            // Prepare chart data
            setChartData({
              labels: dates,
              datasets: [
                {
                  label: `Price in ${currency.toUpperCase()}`,
                  data: prices,
                  borderColor: 'rgba(244,215,21,1)',
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  pointRadius: 2,
                  fill: true,
                },
              ],
            });
    
            // Set chart options
            setChartOptions({
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  enabled: true,
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Date',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: `Price (${currency.toUpperCase()})`,
                  },
                },
              },
            });
          } catch (error) {
            console.error('Error fetching chart data:', error);
          }
        setLoading(false)
    };

    const openPredictions = () => {
        setOpenPlaceMenu(false)
        setOpenGoDownMenu(false)
        setOpenGoUpMenu(false)
        setAmount(null)
        setTimeout(() => {
            setOpenPredictionsMenu(true)
        }, 400)
    }
    const closePredictions = () => {
        setOpenPredictionsMenu(false)
        setOpenGoDownMenu(false)
        setOpenGoUpMenu(false)
        setAmount(null)
        setTimeout(() => {
            setOpenPlaceMenu(true)  
        }, 400)
    }

    const openGoUp = () => {
        setOpenPredictionsMenu(false)
        setOpenPlaceMenu(false)
        setOpenGoDownMenu(false)
        setAmount(null)
        setTimeout(() => {
            setOpenGoUpMenu(true)  
        }, 400)
    }
    const openGoDown = () => {
        setOpenPredictionsMenu(false)
        setOpenPlaceMenu(false)
        setOpenGoUpMenu(false)
        setAmount(null)
        setTimeout(() => {
            setOpenGoDownMenu(true)  
        }, 400)
    }

    /* useEffect(() => {
        if(amount){
            setBalance((prevBal) => prevBal - amount)
        }
    }, [amount]) */

    const handlePrediction = async (type) => {
        console.log(name)
        console.log(price)
        const now = new Date().getTime();
        console.log(now)
        if(!amount){
            message.error("You must enter the amount for your prediction!")
            return
        }
        if(amount > balance){
            message.error("You don't have anough balance!")
            return
        }
        if(amount === 0){
            message.error("The amount can not be 0!")
            return
        }
        const updatedData = {
            userId: user.id,
            date: now,
            crypto: crypto,
            amount: amount,
            type: type,
            currency: currency,
            symbol: symbol,
            name: name,
            price: price,
            logo: logo,
            status: "Pending"
        }
        const { data: secondData, error: secondError } = await supabase
            .from('users')
            .select('appBalance')
            .eq('id', user.id)
            if(secondError){
                console.log("second error")
            } else {
                console.log(secondData)
                const appBalance = secondData[0].appBalance
                const newBalance = appBalance - amount
                const parsed = parseFloat(parseFloat(newBalance).toFixed(2))
                setBalance((prev) => prev - amount)
                const { data, error } = await supabase
                .from('predictions')
                .insert([updatedData])
                if (error) {
                console.error('Error retrieving data from Supabase:', error.message);
                } else {
                    const { data: secondData, error: secondError } = await supabase
                    .from('users')
                    .update({appBalance: parsed})
                    .eq('id', user.id)
                    if(secondError){
                        console.log("second error")
                    } else {
                        Swal.fire({
                            title: "Prediction placed!",
                            text: `Token: ${name}\nPrediction: ${type}\nAmount: ${amount} GPZ`,
                            icon: "success"
                        });
                        closePredictions()
                    }
                }
        }
    }

    const fetchPredictions = async () => {
        const { data: secondData, error: secondError } = await supabase
                    .from('predictions')
                    .select('*')
                    .eq('userId', user.id)
                    if(secondError){
                        console.log("second error")
                    } else {
                        console.log(secondData)
                        setMyPredictions(secondData)
                    }
    }

    useEffect(() => {
        if(openPredictionsMenu){
            fetchPredictions();
        }
    }, [openPredictionsMenu])

    const selectCurrency = (e) => {
        setChartData(null)
        setDisabled(true)
        setCurrency(e.target.value)
        setTimeout(() => {
            setDisabled(false)
        }, 3000)
    }

    const selectCrypto = (e) => {
        setChartData(null)
        setDisabled(true)
        setCrypto(e.target.value)
        setTimeout(() => {
            setDisabled(false)
        }, 3000)
    }

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const writeBet = async (bet) => {
        const now = new Date().getTime();
        console.log(now)
        const date = bet.date
        const startDate = new Date(date).toLocaleString();
        const finishDate = date + 86400000
        const endDate = new Date(finishDate).toLocaleString();
        const token = bet.crypto
        const name = bet.name
        const type = bet.type
        const symbol = bet.symbol
        const currency = bet.currency
        const price = bet.price
        const amount = bet.amount
        const elapsed = now - date
        console.log("finishDate",finishDate)
        if (elapsed > 86400000) {
            const roundedNumber = Math.ceil(now / date);
            console.log(roundedNumber)
            try {
                const response = await fetch(
                    `https://api.coingecko.com/api/v3/coins/${token}/market_chart?vs_currency=${currency}&days=${roundedNumber}`
                    
                );
                const data = await response.json();
                
                const result = data.prices.find(item => 
                    finishDate >= item[0] && finishDate <= item[0] + 86400000
                  );
                const finalPrice = parseFloat(parseFloat(result[1]).toFixed(2))
                console.log("initial price", price)
                console.log("final price", finalPrice)
                const imageUrl = "https://i.postimg.cc/1zGGy6wv/upOrDown.png"
                if (type === "WILL GO UP") {
                    if (finalPrice > price) {
                        console.log("This go up bet wins");
                        const messageToSend = `📈 ${user.user_metadata.name} has won on PredicTON!!! 📈 🎉🎉🎉\n\nTOKEN: ${name} \nStart date: ${startDate} \nPrice: ${symbol}${price} \n\nPrediction: ${name} ${type} \n\nEnd date: ${endDate} \nPrice after 24h: ${symbol}${finalPrice} \n\nAmount won: ${amount} GPZ ✅`
                        console.log(messageToSend)
                        try {
                            const response = await axios.post('https://temp-server-pi.vercel.app/api/send-message', { messageToSend, imageUrl });
                            
                            if (response.data.success) {
                              console.log('Message sent successfully!');
                            } else {
                              console.log('Failed to send message');
                            }
                          } catch (error) {
                            console.log('Error sending message', error);
                          }
                        const { data: firstData, error: firstError } = await supabase
                        .from('predictions')
                        .update({status: 'Won'})
                        .eq('userId', user.id)
                        .eq('date', date)
                        if(firstError){
                            console.log("second error", firstError)
                        } else {
                           console.log(`data updated for bet with date ${date}`, firstData) 
                           const { data: secondData, error: secondError } = await supabase
                            .from('users')
                            .select('appBalance')
                            .eq('id', user.id)
                            if(secondError){
                                console.log("second error", secondError)
                            } else {
                                const balance = secondData[0].appBalance
                                const newBalance = balance + amount
                                const { data: thirdData, error: thirdError } = await supabase
                                .from('users')
                                .update({appBalance: newBalance})
                                .eq('id', user.id)
                                if(thirdError){
                                    console.log("third error", thirdError)
                                } else {
                                    message.success(`You have won the ${name} prediction!`)
                                }
                            }
                        }
                    } else {
                        message.error(`You have lost the ${name} prediction!`)
                        const { data: firstData, error: firstError } = await supabase
                        .from('predictions')
                        .update({status: 'Won'})
                        .eq('userId', user.id)
                        .eq('date', date)
                        if(firstError){
                            console.log("second error", firstError)
                        }
                        return; // Skip further processing for losing bet
                    }
                }
        
                if (type === "WILL GO DOWN") {
                    if (finalPrice > price) {
                        console.log("This go down bet wins");
                        const messageToSend = `📈 ${user.user_metadata.name} has won on PredicTON!!! 📈 🎉🎉🎉\n\nTOKEN: ${name} \nStart date: ${startDate} \nPrice: ${symbol}${price} \n\nPrediction: ${name} ${type} \n\nEnd date: ${endDate} \nPrice after 24h: ${symbol}${finalPrice} \n\nAmount won: ${amount} GPZ ✅`
                        console.log(messageToSend)
                        try {
      
                            const response = await axios.post('https://temp-server-pi.vercel.app/api/send-message', { messageToSend, imageUrl });
                            
                            if (response.data.success) {
                              console.log('Message sent successfully!');
                            } else {
                              console.log('Failed to send message');
                            }
                          } catch (error) {
                            console.log('Error sending message', error);
                          }
                        const { data: firstData, error: firstError } = await supabase
                        .from('predictions')
                        .update({status: 'Won'})
                        .eq('userId', user.id)
                        .eq('date', date)
                        if(firstError){
                            console.log("second error", firstError)
                        } else {
                           console.log(`data updated for bet with date ${date}`, firstData) 
                           const { data: secondData, error: secondError } = await supabase
                            .from('users')
                            .select('appBalance')
                            .eq('id', user.id)
                            if(secondError){
                                console.log("second error", secondError)
                            } else {
                                const balance = secondData[0].appBalance
                                const newBalance = balance + amount
                                const { data: thirdData, error: thirdError } = await supabase
                                .from('users')
                                .update({appBalance: newBalance})
                                .eq('id', user.id)
                                if(thirdError){
                                    console.log("third error", thirdError)
                                } else {
                                    message.success(`You have won the ${name} prediction!`)
                                }
                            }
                        }
                    } else {
                        message.error(`You have lost the ${name} prediction!`)
                        const { data: firstData, error: firstError } = await supabase
                        .from('predictions')
                        .update({status: 'Lost'})
                        .eq('userId', user.id)
                        .eq('date', date)
                        if(firstError){
                            console.log("second error", firstError)
                        }
                        return; // Skip further processing for losing bet
                    } 
                }
            } catch (err) {
                console.log("error fetching", err)
            }
            await delay(1500);
        } else {
            return
        }
    }

    const fetchResults = async () => {
        
        const { data: firstData, error: firstError } = await supabase
        .from('predictions')
        .select('*')
        .eq('userId', user.id)
        .eq('status', "Pending")
        if(firstError){
            console.log("second error", firstError)
        } 
        if(firstData.length > 0){
            console.log("firstData", firstData) 
            for (const bet of firstData){
                await writeBet(bet)
            }
        } else {
            console.log("no data")
        }
    }

    useEffect(() => {
        fetchResults();  
    }, [user])

  return (
    <ThemeProvider theme={darkTheme}>
    <motion.div initial="out" animate="in" variants={animationFive} transition={transitionLong}>
    <Section style={{backgroundImage: `url(${black})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', 
    backgroundPosition: openPlaceMenu ? 'left center' : openPredictionsMenu ? 'right center' : (openGoDownMenu || openGoUpMenu) ? 'bottom center' : 'center center'}}>
      {openGoUpMenu ? (
            <TopOnlyLine><h2>{name} WILL GO UP</h2></TopOnlyLine>
      ) : openGoDownMenu ? (
            <TopOnlyLine><h2>{name} WILL GO DOWN</h2></TopOnlyLine>
      ) : openPlaceMenu ? (
        <>
            <TopLine style={{marginTop: '6vh'}}>
        <h2>SELECT CURRENCY</h2>
        <Select
            variant="outlined"
            value={currency}
            style={{ width: 100, height: '90%', marginLeft: 'auto', fontFamily: "Quicksand" }}
            onChange={(e) => selectCurrency(e)}
            /* onChange={(e) => {
                setDisabled(true)
                setCurrency(e.target.value)
                setTimeout(() => {
                    setDisabled(false)
                }, 3000)
            }} */
            disabled={disabled}
        >
            <MenuItem value={"usd"} style={{ fontFamily: "Quicksand" }}>USD</MenuItem>
            <MenuItem value={"eur"} style={{ fontFamily: "Quicksand" }}>EURO</MenuItem>
            <MenuItem value={"gbp"} style={{ fontFamily: "Quicksand" }}>GBP</MenuItem>
            <MenuItem value={"inr"} style={{ fontFamily: "Quicksand" }}>INR</MenuItem>
        </Select>
    </TopLine>
    <AbsoluteIconButtonLeft onClick={() => navigate('/')}><ArrowLeftRelative style={{transform: 'translateY(0) rotate(90deg)'}}/></AbsoluteIconButtonLeft>
    <TopLine>
        <h2>SELECT CRYPTO</h2>
        <Select
            variant="outlined"
            value={crypto}
            style={{ width: 100, height: '90%', marginLeft: 'auto', fontFamily: "Quicksand" }}
            onChange={(e) => selectCrypto(e)}
            disabled={disabled}
        >
            <MenuItem value={"the-open-network"} style={{ fontFamily: "Quicksand" }}>TON</MenuItem>
            <MenuItem value={"bitcoin"} style={{ fontFamily: "Quicksand" }}>BTC</MenuItem>
            <MenuItem value={"ethereum"} style={{ fontFamily: "Quicksand" }}>ETH</MenuItem>
            <MenuItem value={"ripple"} style={{ fontFamily: "Quicksand" }}>XRP</MenuItem>
            <MenuItem value={"solana"} style={{ fontFamily: "Quicksand" }}>SOL</MenuItem>
            <MenuItem value={"binancecoin"} style={{ fontFamily: "Quicksand" }}>BNB</MenuItem>
            <MenuItem value={"dogecoin"} style={{ fontFamily: "Quicksand" }}>DOGE</MenuItem>
            <MenuItem value={"tron"} style={{ fontFamily: "Quicksand" }}>TRX</MenuItem>
            <MenuItem value={"polkadot"} style={{ fontFamily: "Quicksand" }}>DOT</MenuItem>
            <MenuItem value={"monero"} style={{ fontFamily: "Quicksand" }}>XMR</MenuItem>
            <MenuItem value={"cardano"} style={{ fontFamily: "Quicksand" }}>ADA</MenuItem>
        </Select>
    </TopLine> 
        </>
      ) : (
        ""
      )}  
    {loading ? (
        <LoadingArea>
        <CircularProgress style={{width: 60, height: 60, color: theme.MainAccent}}/>
        </LoadingArea>
    ) : (
        <>
        {openPlaceMenu && (
            <MenuContainer variants={item} style={{ height: '70vh'}}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                <Logo><img src={logo} alt={logo} style={{borderRadius: '50%'}}/></Logo>
        <SecondLine><h2>{name} - #{rank}</h2></SecondLine>
        <SecondLine><h2>{symbol}{price}</h2></SecondLine>
        <SecondLine><h2>Last 24h: <span style={{color: change > 0 ? "green" : change < 0 ? "red" : "aqua" }}>{change > 0 && "+"}{change}%</span></h2></SecondLine>
        <Chart>
        {chartData ? (
            <Line data={chartData} options={chartOptions} />
            ) : (
            ""// Placeholder while data is being fetched
            )}
        </Chart>
            </MenuContainer>
        )}
        {openPredictionsMenu && (
            <MenuContainer variants={item}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                {myPredictions?.map((pred, index) => {
                    
                    const date = new Date(pred.created_at).toLocaleString();
                    const timeRemaining = timeRemainingMap[pred.date] || 0;
                    
                    return(
                        <TeamBetsHolder key={index}
                      initial={{ height: '100px' }}
                      animate={{ height: expandedIndex === index ? '250px' : '100px' }}
                      transition={{ duration: 0.5 }}>
                    {expandedIndex === index ? <SmallArrowDown style={{ transform: 'rotate(180deg)' }} onClick={() => toggleExpand(index)} /> : <SmallArrowDown onClick={() => toggleExpand(index)} /> }
                    <SmallRower>
                    <SmallAvatar>
                        <Avatar alt="Home Team Logo" src={pred.logo} sx={{
                        width: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 },
                        height: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 }
                        }} />
                    </SmallAvatar> 
                    <SmallAvatar><h2 style={{fontSize: '14px'}}>{date}</h2></SmallAvatar>
                    <SmallAvatar><h2 style={{fontSize: '14px'}}>{pred.name}</h2></SmallAvatar>
                    <SmallAvatar><h2 style={{fontSize: '14px'}}>{pred.type}</h2></SmallAvatar>
                    <SmallAvatar><h2 style={{fontSize: '14px'}}>{pred.status}</h2></SmallAvatar>
                    </SmallRower>
                    {expandedIndex === index && (
                        <LowRower>
                            <MiniRowerRow ><h2>Bet Amount: {pred.amount} GPZ</h2></MiniRowerRow>
                            <MiniRowerRow ><h2>Price: {pred.symbol}{pred.price}</h2></MiniRowerRow>
                            <MiniRowerRow ><h2>Time Remaining: {formatTime(timeRemaining)}</h2></MiniRowerRow>
                        </LowRower>
                    )}
                      </TeamBetsHolder>
                    )
                })}
            </MenuContainer>
        )}
        {openGoUpMenu && (
            <MenuContainer variants={item}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                <Logo><img src={logo} alt={logo} style={{borderRadius: '50%'}}/></Logo>
        <SecondLine><h2>{name} - #{rank}</h2></SecondLine>
        <SecondLine><h2>{symbol}{price}</h2></SecondLine>
        <SecondLine><h2>Last 24h: <span style={{color: change > 0 ? "green" : change < 0 ? "red" : "aqua" }}>{change > 0 && "+"}{change}%</span></h2></SecondLine>
        <InputLine><h2>ENTER AMOUNT:</h2></InputLine>
        <LastLine>
            <Balance><h2>Balance: {balance} GPZ</h2></Balance>
            <Input type="number" onChange={(e) => setAmount(e.target.value)}/>
        </LastLine>
        <SVG>
        <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width="200"
      height="200"
    >
      {/* Rounded background */}
      <motion.circle whileTap={{scale: 0.95}}
        cx="100"
        cy="100"
        r="75"
        fill="#f4f4f40"
        stroke={amount > 0 ? "limegreen" :  "#333"} 
        strokeWidth="5"
        className="circleAbs"
        onClick={() => handlePrediction("WILL GO UP")}
      />

      {/* Smooth upward arrow */}
      <motion.path
      className="motionPath"
        d="M100 140 L100 80 M80 100 L100 80 L120 100" 
        fill="none"
        stroke="#42e90f"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </svg>
        </SVG>
                
            </MenuContainer>
        )}
        {openGoDownMenu && (
            <MenuContainer variants={item}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                <Logo><img src={logo} alt={logo} style={{borderRadius: '50%'}}/></Logo>
        <SecondLine><h2>{name} - #{rank}</h2></SecondLine>
        <SecondLine><h2>{symbol}{price}</h2></SecondLine>
        <SecondLine><h2>Last 24h: <span style={{color: change > 0 ? "green" : change < 0 ? "red" : "aqua" }}>{change > 0 && "+"}{change}%</span></h2></SecondLine>
        <InputLine><h2>ENTER AMOUNT:</h2></InputLine>
        <LastLine>
            <Balance><h2>Balance: {balance} GPZ</h2></Balance>
            <Input type="number" onChange={(e) => setAmount(e.target.value)}/>
        </LastLine>
        <SVG>
        <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width="200"
      height="200"
    >
      {/* Rounded background */}
      <motion.circle whileTap={{scale: 0.95}}
        cx="100"
        cy="100"
        r="75"
        fill="#f4f4f40"
        stroke={amount > 0 ? "#f31111" :  "#333"} 
        strokeWidth="5"
        className="circleAbs"
        onClick={() => handlePrediction("WILL GO DOWN")}
      />

      {/* Smooth upward arrow */}
      <motion.path
        d="M100 70 L100 140 M70 110 L100 140 L130 110"
        fill="none"
        stroke="#f31111"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </svg>
        </SVG>
        
            </MenuContainer>
        )}
        <BottomRow>
            <IconHolder><h2 onClick={closePredictions} style={{color: openPlaceMenu ? "rgba(244,215,21,1)" : ""}}>CHARTS</h2></IconHolder>
            <IconHolder><h2 onClick={openGoUp} style={{color: openGoUpMenu ? "rgba(244,215,21,1)" : ""}}>{name} <br/> WILL GO<br/> UP</h2></IconHolder>
            <IconHolder><h2 onClick={openGoDown} style={{color: openGoDownMenu ? "rgba(244,215,21,1)" : ""}}>{name} <br/> WILL GO<br/> DOWN</h2></IconHolder>
            <IconHolder><h2 onClick={openPredictions} style={{color: openPredictionsMenu ? "rgba(244,215,21,1)" : ""}}>MY PREDICTIONS</h2></IconHolder>
        </BottomRow>
        </>
    )}
    </Section>
    </motion.div>
    </ThemeProvider>
  )
}

export default CryptoPrediction

const Section = styled.div`
    width: 100vw;
    height: 100vh;
    position: relative;
    ${props => props.theme.displayFlexColumn}
    background: ${props => props.theme.body};
    overflow: hidden;
`;

const CoinList = (currency) =>
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
  
const SingleCoin = (id) =>
    `https://api.coingecko.com/api/v3/coins/${id}`;
  
const HistoricalChart = (id, days, currency) =>
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;
  
const TrendingCoins = (currency) =>
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;
  
const chartDays = [
      {
        label: "24 Hours",
        value: 1,
      },
      {
        label: "30 Days",
        value: 30,
      },
      {
        label: "3 Months",
        value: 90,
      },
      {
        label: "1 Year",
        value: 365,
      },
];

const MenuContainer = styled(motion.div)`
    width: 100%;
    height: 75vh;
    ${props => props.theme.displayFlexColumnCenter}
`;

const TopLine = styled.div`
    width: 80vw;
    height: 7.5vh;
    ${props => props.theme.displayFlex}
    padding: 5px;
    margin: 5px 0;
    h2{
        color: ${props => props.theme.MainAccent};
        font-size: 18px;

    }
`;
const TopOnlyLine = styled.div`
    width: 100vw;
    height: 12.5vh;
    ${props => props.theme.displayFlexCenter}
    padding: 10px;
    h2{
        color: ${props => props.theme.text};
        font-size: 24px;

    }
`;
const LoadingArea = styled.div`
    width: 100vw;
    height: 85vh;
    ${props => props.theme.displayFlexCenter}
`;
const SecondLine = styled.div`
    width: 100vw;
    height: 5vh;
    ${props => props.theme.displayFlexCenter}
    padding: 10px;
    h2{
        color: ${props => props.theme.text};
        font-size: 24px;

    }
`;
const InputLine = styled.div`
    width: 100vw;
    height: 15vh;
    ${props => props.theme.displayFlexCenter}
    padding: 10px;
    h2{
        font-size: 20px;
        color: white;
    }
`;

const Input = styled.input`
    width: 40%;
    height: 95%;
    border: 1px solid white;
    border-radius: 8px;
    padding: 10px;
    transform: translateY(-15px);
    text-align: center;
    font-size: 24px;
    color: aqua;
    background: transparent;
    &:focus{
        outline: none;
    }
`;
const Balance = styled.div`
    width: 60%;
    height: 5%;
    transform: translateY(-25px);
    padding: 10px;
    background: transparent;
    text-align: center;
    h2{
        color: white;
        font-size: 12px !important;
    }
`;
const LastLine = styled.div`
    width: 100vw;
    height: 10vh;
    ${props => props.theme.displayFlexColumn}
    padding: 10px;
    h2{
        color: ${props => props.theme.text};
        font-size: 24px;

    }
`;

const Logo = styled.div`
    width: 50%;
    height: 10vh;
    ${props => props.theme.displayFlexCenter}
    transform: translateY(-10px);
    img{
        width: 40%;
        display: block;
        object-fit: cover;
    }
`;

const Chart = styled.div`
    width: 100%;
    height: 40vh;
    ${props => props.theme.displayFlexCenter};
`;
const SVG = styled.div`
    width: 100%;
    height: 30vh;
    ${props => props.theme.displayFlexCenter};
`;



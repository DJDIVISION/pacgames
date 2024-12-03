import React, {useState,useEffect} from 'react'
import styled, {useTheme} from 'styled-components'
import { BottomRow, IconHolder, item} from './indexThree'
import { StyledButton } from '../components'
import { motion } from 'framer-motion'
import Select from '@mui/material/Select';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuItem from "@mui/material/MenuItem";
import axios from 'axios'
import { CircularProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { transitionLong,animationFive } from '../animations';
import { FantasyState } from '../context/FantasyContext'

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
    const [historicData, setHistoricData] = useState();
    const [chartData, setChartData] = useState(null);
    const [openPlaceMenu, setOpenPlaceMenu] = useState(true);
    const [openPredictionsMenu, setOpenPredictionsMenu] = useState(false);
    const [openGoUpMenu, setOpenGoUpMenu] = useState(false);
    const [openGoDownMenu, setOpenGoDownMenu] = useState(false);
    const [chartOptions, setChartOptions] = useState({});
    const [days, setDays] = useState(1);
    const [flag,setflag] = useState(false);
    const [amount, setAmount] = useState(null)
    const theme = useTheme();

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
            setPrice(res.market_data.current_price[currency])
            setflag(true)
        })
        .catch(err => console.error(err));
    }

    useEffect(() => {
        if(flag){
            fetchHistoricData()
        }
    }, [flag,crypto,currency,days])

    useEffect(() => {
        if(crypto && currency){
            fetchCrypto()
        }
    }, [crypto,currency])

    const trendingCoins  = () => {
        const options = {
        method: 'GET',
        headers: {accept: 'application/json', 'x-cg-demo-api-key': 'CG-3qkmGTgTWXenAouD9JshQYt6'}
      };
      
      fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`, options)
        .then(res => res.json())
        .then(res => {
            console.log(res)
        })
        .catch(err => console.error(err));
    }

    const fetchHistoricData = async () => {
        try {
            const response = await fetch(
              `https://temp-server-pi.vercel.app/api/cryptocurrency/${crypto}/chart?days=${days}&currency=${currency}`
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

    useEffect(() => {
        if(amount){
            setBalance((prevBal) => prevBal - amount)
        }
    }, [amount])

    

  return (
    <ThemeProvider theme={darkTheme}>
    <motion.div initial="out" animate="in" variants={animationFive} transition={transitionLong}>
    <Section>
      {openGoUpMenu ? (
            <TopOnlyLine><h2>{name} WILL GO UP</h2></TopOnlyLine>
      ) : openGoDownMenu ? (
            <TopOnlyLine><h2>{name} WILL GO DOWN</h2></TopOnlyLine>
      ) : openPlaceMenu ? (
        <>
            <TopLine>
        <h2>SELECT CURRENCY</h2>
        <Select
            variant="outlined"
            value={currency}
            style={{ width: 100, height: '90%', marginLeft: 'auto', fontFamily: "Quicksand" }}
            onChange={(e) => setCurrency(e.target.value)}
            
        >
            <MenuItem value={"usd"} style={{ fontFamily: "Quicksand" }}>USD</MenuItem>
            <MenuItem value={"eur"} style={{ fontFamily: "Quicksand" }}>EURO</MenuItem>
            <MenuItem value={"gbp"} style={{ fontFamily: "Quicksand" }}>GBP</MenuItem>
            <MenuItem value={"inr"} style={{ fontFamily: "Quicksand" }}>INR</MenuItem>
        </Select>
    </TopLine>
    <TopLine>
        <h2>SELECT CRYPTO</h2>
        <Select
            variant="outlined"
            value={crypto}
            style={{ width: 100, height: '90%', marginLeft: 'auto', fontFamily: "Quicksand" }}
            onChange={(e) => setCrypto(e.target.value)}
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
            <MenuContainer variants={item}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                <Logo><img src={logo} alt={logo} style={{borderRadius: '50%'}}/></Logo>
        <SecondLine><h2>{name} - #{rank}</h2></SecondLine>
        <SecondLine><h2>{symbol}{price}</h2></SecondLine>
        <SecondLine></SecondLine>
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
                PREDICTIONS MENU
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
        <SecondLine></SecondLine>
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
            <IconHolder><h2 onClick={closePredictions} style={{color: openPlaceMenu ? "rgba(244,215,21,1)" : ""}}>PLACE PREDICTION</h2></IconHolder>
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
  
const SingleCoin = (id="drip-network") =>
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
    width: 100vw;
    height: 7.5vh;
    ${props => props.theme.displayFlex}
    padding: 10px;
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
        font-size: 18px;

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
    height: 15vh;
    ${props => props.theme.displayFlexCenter}
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



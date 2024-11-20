import React,{useEffect, useState} from 'react'
import {motion,useAnimation, AnimatePresence} from 'framer-motion'
import { CloseStats,BetSection,DepositWrapper,LinkInputField,SmallDepositTitle,DepositTitle,DepositBigTitle,BalanceWrapper, Tiers, Tier, TopTierRow, SecondTierRow, BigTierRow } from './index' 
import {BetInput, StyledButton, StyledMenu} from '../../components/index'
import  { useTheme } from 'styled-components'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components';
import { FantasyState } from '../../context/FantasyContext';
import { useAuth } from '../../pages/functions';
import { supabase } from '../../supabase/client';
import {useInView} from "react-intersection-observer";

const WalletMenu = ({setIsWithdrawExpanded,isWithdrawExpanded}) => {

    const tiers = [
        {
            id: 1,
            wager: 3
        },
        {
            id: 2,
            wager: 1
        },
        {
            id: 3,
            wager: 0
        }
    ]
    const {user} = useAuth();
    const theme = useTheme();
    const navigate = useNavigate()
    const [tier, setTier] = useState(null)
    const [deposits, setDeposits] = useState(null)
    const [wagerBalance, setWagerBalance] = useState(null)

    const [rest, setRest] = useState(null)
    const [needed, setNeeded] = useState(null)
    const [percentage, setPercentage] = useState(null)
    const [percentageTwo, setPercentageTwo] = useState(null)
    const [percentageLeft, setPercentageLeft] = useState(null)
    const {walletMenu, setWalletMenu} = FantasyState();
    const {ref, inView} = useInView({
        threshold: 0.2
    });

    const animation = useAnimation();

    useEffect(() => {
        if(inView && percentage){
            animation.start({
                width: percentage,
                transition: {
                    duration: 1,
                    delay: 0.5
                }
            });
        }
        if(!inView){
            animation.start({
                width: 0, 
            })
        }
        
    }, [inView,percentage])

    function ChangeNumber () {
        const counters = document.querySelectorAll('.graphcounter');
        counters.forEach(counter => {
            counter.innerText = "0";

            const updateCounter = () => {
                const target = +counter.getAttribute('data-target');
                const c = +counter.innerText;

                const increment = target / 100;
                
                if (c < target){
                    counter.innerText = `${Math.ceil(c + increment)}`;
                    setTimeout(updateCounter, 2);
                } else {
                    counter.innerText = target;
                }
            }
            updateCounter();
        });
    }

    useEffect(() => {
        if(inView && percentage){
            ChangeNumber();
        }
    }, [inView,percentage])
    
    const getbarValue = () => {
        if(tier === 1){
            const rest = deposits[0].gpz * 3 - wagerBalance
            setNeeded(deposits[0].gpz * 3)
            setRest(rest)
            const percentage = parseFloat(((wagerBalance / (deposits[0].gpz * 3)) * 100).toFixed(2))
            const percentageLeft = (rest / (deposits[0].gpz * 3)) * 100
            setPercentage(percentage + "%")
            setPercentageTwo(percentage)
            setPercentageLeft(percentageLeft)
         }
    }

    useEffect(() => {
        getbarValue();
    }, [tier])

    const closeWalletMenu = () => {
        setIsWithdrawExpanded(false)
    }
    
    const getDeposits = async() => {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            setTier(data[0].deposits.deposits.length)
            setDeposits(data[0].deposits.deposits)
            setWagerBalance(data[0].wagerBalance)
          }
    }

    console.log(tier)
    console.log(deposits)
    console.log(wagerBalance)

    useEffect(() => {
        if(user){
            getDeposits();
        }
    }, [user])


    const item={
        initial: { height: 0, opacity: 0 },
        animate: { height: '100vh', opacity: 1, transition: { duration: 0.5 } },
        exit: { height: 0, opacity: 0, transition: { duration: 0.5 } }
    } 
    console.log(walletMenu)

    const ProgressBar = styled.div`
    width: 95%;
    height: 10px;
    border-radius: 10px;
    border: 1px solid ${props => props.theme.MainAccent};
    background: red;
    position: relative;
    margin-bottom: 20px;
`;

const ProgressBarTop = styled(motion.div)`
    max-width: 100%;
    height: 9px;
    border-radius: 10px;
    border: 1px solid ${props => props.theme.MainAccentTwo};
    background: green;
    position: absolute;
    top: 0;
    left: 0;
`;
    

  return (
    
    <StyledMenu variants={item} ref={ref}
    initial="initial"
    animate="animate"
    exit="exit"
    style={{alignItems: 'center', overflow: 'hidden', zIndex: 1000}}>
        <DepositBigTitle>YOUR TIER</DepositBigTitle>
     <CloseStats onClick={closeWalletMenu} /> 
     <Tiers>
        {tiers?.map((el) => {
            const index = el.id - 1
            console.log(tier)
            return(
                <Tier style={{
                    border: el.id === tier ? `1px solid green` : `1px solid red`,
                    background: el.id === tier ? `rgba(91, 214, 19, 0.8)` : `rgb(223, 23, 23)`
                }}>
                    <TopTierRow><h2>{el.id === 1 ? el.id + "st" : el.id === 2 ? el.id + "nd" : el.id + "rd"}</h2></TopTierRow>
                    <SecondTierRow style={{transform: 'translateY(-5px)'}}><h3>WITHDRAW</h3></SecondTierRow>
                    <SecondTierRow><h2>{el.wager === 3 ? `WAGER x3 TIMES` : el.wager === 1 ? `WAGER x1 TIME` : 'NO WAGER'}</h2></SecondTierRow>
                    <SecondTierRow style={{transform: 'translateY(5px)'}}>{el.id === tier ? <h2>YOU DEPOSITED</h2> : ""}</SecondTierRow>
                    <BigTierRow>{el.id === tier ? <h2>{deposits[index]?.amount} {deposits[index]?.token}</h2> : ""}</BigTierRow>
                    <SecondTierRow style={{transform: 'translateY(5px)'}}>{el.id === tier ? <h2>YOU RECEIVED</h2> : ""}</SecondTierRow>
                    <BigTierRow>{el.id === tier ? <h2>{deposits[index]?.gpz} PGZ</h2> : ""}</BigTierRow>
                </Tier>
            )
        })}
     </Tiers>
     <DepositBigTitle >YOU HAVE BET: <br/>{wagerBalance} from {needed} PGZ</DepositBigTitle>
     
        <ProgressBar>
            <ProgressBarTop animate={animation}/>
        </ProgressBar>
     
     <DepositBigTitle style={{height: '5%'}}>ACCOMPLISHED: <h2 className="graphcounter" data-target={percentageTwo}></h2><h2>%</h2> </DepositBigTitle>
     <DepositBigTitle style={{height: '5%'}}><h2>REMAINING:</h2> <h2 className="graphcounter" data-target={rest}></h2> PGZ</DepositBigTitle>
     <DepositBigTitle ><StyledButton style={{fontSize: '18px'}}>WITHDRAW</StyledButton></DepositBigTitle>
    </StyledMenu>
    
  )
}

export default WalletMenu





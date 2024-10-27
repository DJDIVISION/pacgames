import React,{useEffect, useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import { CloseStats,BetSection,DepositWrapper,LinkInputField,DepositRow } from './index' 
import {BetInput} from '../../components/index'
import { TonConnectUI } from '@tonconnect/ui-react';
import { StyledButton } from '../../pages';
import { TonClient, WalletContractV4, internal, fromNano } from "@ton/ton";
import { mnemonicNew, mnemonicToPrivateKey } from "@ton/crypto";


/* import TonWeb from 'tonweb'; */
import axios from 'axios';
import { FantasyState } from '../../context/FantasyContext';


const DepositMenu = ({depositMenu,setDepositMenu}) => {

    const [amount, setAmount] = useState(0);
    const [client, setClient] = useState(null);
    const {walletAddress, setWalletAddress} = FantasyState();
    const {balance, setBalance} = FantasyState();

    useEffect(() => {
        // Initialize TON client
        const tonClient = new TonClient({
          endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC', // or your preferred endpoint
          apiKey: 'c4d8cb87-4cf0-4d8a-a173-2d945c113edc' // replace with your API key
        });
        setClient(tonClient);
      }, []);
 
    const closeDepositMenu = () => {
        setDepositMenu(false)
    }
    const teamWalletAddress = "0QA9CPg5-7jCfSpvBiyBjcQL4wmKFm3nZkr0R21EqcuxauVE"
    
    
    console.log(client)
    console.log(walletAddress)
    console.log("balance", balance)

    const fetchBalance = async (address) => {
        setLoading(true);
        try {
            const client = new TonClient({
                endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC', // Change to mainnet when ready
                apiKey: 'c4d8cb87-4cf0-4d8a-a173-2d945c113edc' // Replace with your API key from TON Center
            });
            const result = await client.getBalance(address);
            setBalance(fromNano(result.balance)); // Convert balance from nanoTONs to TONs
        } catch (error) {
            console.error('Error fetching balance:', error);
        } finally {
            setLoading(false);
        }
    };


    const item={
        initial: { height: 0, opacity: 0 },
        animate: { height: 660, opacity: 1, transition: { duration: 0.5 } },
        exit: { height: 0, opacity: 0, transition: { duration: 0.5 } }
    } 

  return (
    <AnimatePresence>
    <motion.div className="menu-container-seven" variants={item}
    initial="initial"
    animate="animate"
    exit="exit">
     <CloseStats onClick={closeDepositMenu} /> 
     <BetSection>
        <DepositWrapper>
            PACTON'S GAMING ZONE WALLET ADDRESS:
            <LinkInputField disabled={true} value={teamWalletAddress}/>
            <DepositRow>
                AMOUNT TO DEPOSIT: <BetInput style={{borderRadius: '10px'}} onChange={(e) => setAmount(e.target.value)}/>
            </DepositRow>
            <DepositRow>
                <StyledButton onClick={() => fetchBalance()}>DEPOSIT</StyledButton>
            </DepositRow>
        </DepositWrapper>
     </BetSection>
    </motion.div>
    </AnimatePresence>
  )
}

export default DepositMenu

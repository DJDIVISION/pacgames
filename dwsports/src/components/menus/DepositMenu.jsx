import React,{useEffect, useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import { CloseStats,BetSection,DepositWrapper,LinkInputField,DepositRow,DepositTitle,DepositBigTitle } from './index' 
import {BetInput} from '../../components/index'
import { StyledButton } from '../../pages';
import { TonClient, Address, internal } from '@ton/ton';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { mnemonicNew, mnemonicToPrivateKey } from "@ton/crypto";


/* import TonWeb from 'tonweb'; */
import axios from 'axios';
import { FantasyState } from '../../context/FantasyContext';
import { BalanceDisplay, useAuth } from '../../pages/functions';
import { supabase } from '../../supabase/client';
import { message } from 'antd';


const DepositMenu = ({depositMenu,setDepositMenu}) => {

    const [amount, setAmount] = useState(0);
    const [tonConnectUI, setOptions] = useTonConnectUI();
    const [transactionStatus, setTransactionStatus] = useState('');
    const [client, setClient] = useState(null);
    const wallet = useTonWallet();
    const {balance, setBalance} = FantasyState();
    const {walletBalance,setWalletBalance} = FantasyState();
    const [transactionHash, setTransactionHash] = useState(null);
    console.log("balance", balance)
    const {user} = useAuth();
 
    const closeDepositMenu = () => {
        setDepositMenu(false)
    }
    const teamWalletAddress = "kQDou06VuEO-u3S56M3TnXjQG98hN552PKyyltQJzbkqi06c"
    
    const handleSendTransaction = () => {
        // Transaction details based on tonConnectUI structure
        const myTransaction = {
            validUntil: Math.floor(Date.now() / 1000) + 60, // Transaction expiration in 60 seconds
            messages: [
                {
                    address: 'kQDou06VuEO-u3S56M3TnXjQG98hN552PKyyltQJzbkqi06c', // Recipient Address
                    amount: (amount * 1e9).toString(), // Amount in nanoTONs, here 1.5 TON
                },
            ],
        };

        const client = new TonClient({
            endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
        });

        try {
            tonConnectUI.sendTransaction(myTransaction)
                .then(async () => {
                    setTransactionStatus('Transaction sent successfully.');
                    const { data, error } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', user.id);

                    if (error) {
                        console.error('Error fetching user data:', error.message);
                    } else {
                        if (data.length === 0) {
                            message.error("This user does not exist in our database");
                        } else {
                            console.log(data);
                            const userJsonData = data[0].deposits || {};
                            const userBalance = data[0].appBalance || 0;
                            userJsonData.deposits = userJsonData.deposits || [];
                            const d = new Date();
                            let date = d.toLocaleString();
                            const updatedData = {
                                token: "TON",
                                amount: amount,
                                date: date,
                                senderAddress: wallet.account.address
                            };

                            // Add the updated data to the referrals array
                            userJsonData.deposits.push(updatedData);

                            // Update the user's jsonb column
                            const { error: updateError } = await supabase
                                .from('users')
                                .update([{ deposits: userJsonData }]) // Update the jsonb column
                                .eq('id', user.id); // Identify which user to update

                            if (updateError) {
                                console.error('Error updating user data:', updateError.message);
                            } else {
                                console.log('User data updated successfully:', userJsonData);
                                message.success("Your balance has been updated!");
                            }

                            const newBalance = userBalance + (amount * 1000)

                            const { error: updateReferral } = await supabase
                                .from('users')
                                .update({ appBalance: newBalance }) 
                                .eq('id', user.id); 

                            if (updateReferral) {
                                console.error('Error updating user data:', updateReferral.message);
                            } else {
                                console.log("User data updated successfully!");
                            }
                        }
                    }
                    setBalance((prevBalance) => prevBalance + (amount * 1000));
                })
                .catch(error => {
                    console.error('Transaction failed:', error);
                    setTransactionStatus(`Transaction failed: ${error.message}`);
                });
        } catch (error) {
            console.error('Transaction initiation failed:', error);
            setTransactionStatus(`Transaction initiation failed: ${error.message}`);
        }
    };


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
        animate: { minHeight: '100vh', opacity: 1, transition: { duration: 0.5 } },
        exit: { height: 0, opacity: 0, transition: { duration: 0.5 } }
    } 

  return (
    <AnimatePresence>
    <motion.div className="menu-container-seven" variants={item}
    initial="initial"
    animate="animate"
    exit="exit">
        <DepositBigTitle>RATIO: 1TON - 1000 PGZ</DepositBigTitle>
     <CloseStats onClick={closeDepositMenu} /> 
     
        <DepositWrapper>
            <DepositTitle>PACTON'S GAMING ZONE WALLET ADDRESS:</DepositTitle>
            <DepositTitle><LinkInputField disabled={true} value={teamWalletAddress}/></DepositTitle>
            <DepositTitle>YOUR BALANCE: {parseFloat(walletBalance)}<span>TON</span></DepositTitle>
            <DepositTitle>AMOUNT TO DEPOSIT:</DepositTitle>
            <DepositTitle><BetInput style={{borderRadius: '10px'}} value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}/></DepositTitle>
            {/* <DepositRow>
                AMOUNT TO DEPOSIT: <BetInput style={{borderRadius: '10px'}} value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}/>
            </DepositRow> */}
            <DepositTitle>
                <StyledButton onClick={handleSendTransaction}>DEPOSIT</StyledButton>
            </DepositTitle>
            <span>{transactionStatus}</span>
        </DepositWrapper>
        <BalanceDisplay balance={balance}/>
    </motion.div>
    </AnimatePresence>
  )
}

export default DepositMenu

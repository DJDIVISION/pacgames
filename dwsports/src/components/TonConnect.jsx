import React, {useEffect} from 'react';
import { TonConnectButton, TonConnectUIProvider, useTonConnectUI, useTonWallet  } from '@tonconnect/ui-react';
import { supabase } from '../supabase/client';
import { BetState } from '../context/BetsContext';
import { useAuth } from '../pages/functions';
import { FantasyState } from '../context/FantasyContext';

const TonWalletLogin = () => {
    const wallet = useTonWallet();
    const { user } = useAuth();
    const {walletAddress, setWalletAddress} = FantasyState();
    const {balance, setBalance} = FantasyState();

    const fetchBalance = async (address) => {
    if (!client) return;

    try {
      const response = await client.getBalance(address);
      setBalance(response.balance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  };
  console.log(user)
  

  return (
    
      <TonConnectButton />
    
  );
};

export default TonWalletLogin
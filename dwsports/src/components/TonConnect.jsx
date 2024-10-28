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
  useEffect(() => {
    const writeData = async () => {
      if(user){
        if (wallet) {
          setWalletAddress(wallet.account.address)
          console.log('Wallet connected:', wallet);
          const updatedData = {
            name: user.user_metadata.name,
            avatar: user.user_metadata.avatar_url,
            email: user.mail,
            walletAddress: wallet.account.address
          }
          const { data, error } = await supabase
          .from('user_logins')
          .insert([updatedData])
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            console.log('User session data saved:', data)
          }
          console.log('Wallet address:', wallet);
        } else {
          console.log('Wallet disconnected');
        }
      }
    }
    writeData();
    
  }, [wallet, user]);

  return (
    
      <TonConnectButton />
    
  );
};

export default TonWalletLogin
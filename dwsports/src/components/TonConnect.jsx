import React, {useEffect} from 'react';
import { TonConnectButton, TonConnectUIProvider, useTonConnectUI, useTonWallet  } from '@tonconnect/ui-react';
import { supabase } from '../supabase/client';
import { BetState } from '../context/BetsContext';
import { useAuth } from '../pages/functions';

const TonWalletLogin = () => {
    const wallet = useTonWallet();
    const { user } = useAuth();

  useEffect(() => {
    const writeData = async () => {
      if(user){
        if (wallet) {
          console.log('Wallet connected:', wallet);
          const mail = user.email
          const { data, error } = await supabase
          .from('user_logins')
          .update({walletAddress: wallet.account.address})
          .eq("email", mail);
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            console.log('User session data saved:', data)
          }
          console.log('Wallet address:', wallet.account.address);
        } else {
          console.log('Wallet disconnected');
        }
      }
    }
    writeData();
    
  }, [wallet, user]);

  return (
    <div>
      <TonConnectButton />
    </div>
  );
};

export default TonWalletLogin
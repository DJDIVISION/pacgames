import React, {useEffect} from 'react';
import { TonConnectButton, TonConnectUIProvider, useTonConnectUI, useTonWallet  } from '@tonconnect/ui-react';

const TonWalletLogin = () => {
    const wallet = useTonWallet();

  useEffect(() => {
    if (wallet) {
      console.log('Wallet connected:', wallet);
      // Access wallet information here
      console.log('Wallet address:', wallet.account.address);
    } else {
      console.log('Wallet disconnected');
    }
  }, [wallet]);

  return (
    <div>
      <TonConnectButton />
    </div>
  );
};

export default TonWalletLogin
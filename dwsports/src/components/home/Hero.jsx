import React, { useEffect, useState, useRef } from 'react';
import styled, {useTheme} from 'styled-components'
import { motion, useTransform, useScroll, useAnimation, AnimatePresence } from 'framer-motion';
import {HeroSection, StyledButton} from './index'
import Ton from '../../assets/logos/ton.png'
import Sho from '../../assets/logos/sho.png'
import connect from '../../assets/logos/connect.png'
import { TonConnectButton, TonConnectUIProvider, useTonConnectUI, useTonWallet, useTonAddress } from '@tonconnect/ui-react';
import { getUserBalance, useAuth } from '../../pages/functions';
import { message } from 'antd';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import SendIcon from '@mui/icons-material/Send';
import { Avatar, Button, IconButton, Switch } from '@mui/material';
import { supabase } from '../../supabase/client';
import { MiniArrowDown, MiniArrowup, SmallArrowDownFlex, MiniIconButton } from '../../pages';
import { FantasyState } from '../../context/FantasyContext';
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom'
import { RowerSmall,LowRower,RowerRowBets,TeamBetsHolder,AvatarRowBets,WalletsRow,IconsRow } from './index';
import googleDark from '../../assets/logos/googleDark.png'
import googleLight from '../../assets/logos/googleLight.png'
import metamask from '../../assets/logos/metamask.svg'
import Swal from "sweetalert2";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import Web3 from "web3";
import axios from 'axios';
import { messaging } from '../../firebase.jsx';
import { getToken, onMessage } from "firebase/messaging";
import {initializePushNotifications} from '../../push.js'

const Hero = () => {

    const ref = useRef(null);
    const isDesktop = useMediaQuery({ query: '(min-width: 1100px)' });
    const isMobile = useMediaQuery({ query: '(max-width: 498px)' });
    const [t, i18n] = useTranslation("global");
    const { user } = useAuth(); 
    const theme = useTheme();
    const [disabledInput, setDisabledInput] = useState(false)
    const [checked, setChecked] = useState(false);
    const [referrerValue, setReferrerValue] = useState("")
    const [referrals, setReferrals] = useState([])
    const [isExpanded, setIsExpanded] = useState(false)
    const {provider, setProvider} = FantasyState();
    const {account, setAccount} = FantasyState();
    const {balance, setBalance} = FantasyState();
    const {metaMaskWalletBalance,setMetaMaskWalletBalance} = FantasyState();
    const {tonWalletBalance,setTonWalletBalance} = FantasyState();
    const {metaMaskWalletAddress, setMetaMaskWalletAddress} = FantasyState();
    const {tonWalletAddress, setTonWalletAddress} = FantasyState();
    const {toHide, setToHide} = FantasyState();
    const navigate = useNavigate()
    const [date, setDate] = useState(null)
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const [expandedProfile, setExpandedProfile] = useState(true);
    const [expandedWallet, setExpandedWallet] = useState(false);
    const [expandedReferrals, setExpandedReferrals] = useState(false);
    const [expandedLinks, setExpandedLinks] = useState(false);
    const controls = useAnimation();
    const userFriendlyAddress = useTonAddress();

    

    async function sendNotification(notificationPayload) {
        const email = "bodegaflamenca666@gmail.com"
        try {
          const response = await axios.post('https://tpv-2-0-server.vercel.app/api/send-notification', {
            email: email,
            notificationPayload
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
      
          console.log('Notification sent successfully:', response.data);
        } catch (error) {
          console.error('Error sending notification:', error);
        }
      }
    
      const handleSendNotification = () => {
        const notificationPayload = {
          title: 'Hello Bitches!',
          body: 'You may suck my dick now.',
          //icon: 'path/to/icon.png' // Optional
        };
    
        sendNotification(notificationPayload);
      };

    const subscribeToNotifications = () => {
        const email = user.email
        initializePushNotifications(email);
    };

    console.log(user)

    const disconnectWallet = async () => {
        setMetaMaskWalletAddress(null)
        try {
          if (provider) {
            await provider.disconnect(); // Disconnect the WalletConnect session
            setProvider(null); // Clear the provider from state
            setAccount(null); // Clear the account address from state
            console.log("Disconnected from wallet");
            
          }
        } catch (error) {
          console.error("Error disconnecting wallet:", error);
        }
        Swal.fire({
            title: "Wallet Disconnected!",
            text: "Your Wallet is now disconnected",
            icon: "success"
          });
      };

    
    useEffect(() => {
        if(userFriendlyAddress){
            setTonWalletAddress(userFriendlyAddress)
        }
    }, [userFriendlyAddress])

    const expandDiv = () => {
        setIsExpanded((prev) => !prev);
    }

    const getReferrer = async () => {
        const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id);

        if (error) {
            console.error('Error fetching user data:', error.message);
        } 
        if(data){
            if(data[0].hasReferrer === true){
                setDisabledInput(true)
                setReferrerValue(data[0].referrerLink)
            }
            if(data[0].referralData !== null){
                setReferrals(data[0].referralData.referrals)
            }
            if(data[0].appBalance > 0){
                setBalance(data[0].appBalance)
            }
        }
    }

    

    const getUserBalance = async (id) => {
        
        const { data, error } = await supabase
            .from('users')
            .select('appBalance')
            .eq("id", id)
      
          if (error) {
            console.error('Error fetching teams:', error.message);
            return;
          }
          if (data) {
            setBalance(data[0].appBalance)
          }
    }

    useEffect(() => {
        if(user){
            const signDate = user.last_sign_in_at;
            const date = new Date(signDate);
            const milliseconds = date.getTime();
            const now = Date.now();
            if (now - milliseconds < 5000) {
              storeUserData(user); 
            } else {
              return
            }
          }
        if(user){
            const signDate = user.last_sign_in_at;
            const date = new Date(signDate);
            const locale = date.toLocaleString();
            setDate(locale)
            getReferrer();
            getUserBalance(user.id)
        }
        
    }, [user])

    const startAnimationSequence = () => {
        controls.start({
            rotateY: [0, 720, 0],
            transition: {
                duration: 6,
                ease: "easeInOut",
            },
        }).then(() => {
            // Pause for 3 seconds after the rotation
            setTimeout(startAnimationSequence, 3000); // Restart after 3 seconds
        });
    };

    useEffect(() => {
        startAnimationSequence();
    }, []);

    function clipboard() {
        var copyText = document.getElementById("referralLink");
        copyText.select();
        copyText.setSelectionRange(0, 99999); 
        navigator.clipboard.writeText(copyText.value);
        message.success("Link copied to clipboard")
    }
    
    const sendLink = async () => {
        if(disabledInput === true){
            message.error(`${t("hero.message1")}`)
            return
        }
        const referral = document.getElementById("referralLink").value;
        const referrer = document.getElementById("referrerLink").value;
    
        if (referral === referrer) {
            message.error(`${t("hero.message2")}`);
            return; // Exit the function early
        }
    
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('referralLink', referrer);
    
        if (error) {
            console.error('Error fetching user data:', error.message);
        } else {
            if (data.length === 0) {
                message.error(`${t("hero.message3")}`);
            } else {
                console.log(data);
    
                // Assume you want to update a jsonb column called `referralData`
                const userId = data[0].id; // Get the user's ID
                const userJsonData = data[0].referralData || {}; // Get existing jsonb data, if any
    
                // Initialize referrals array if it doesn't exist
                userJsonData.referrals = userJsonData.referrals || []; 
    
                // Prepare the updated data structure to add
                const updatedData = {
                    name: user.user_metadata.name,
                    avatar: user.user_metadata.avatar_url,
                    email: user.email,
                    user_id: user.id
                };
    
                // Add the updated data to the referrals array
                userJsonData.referrals.push(updatedData);
    
                // Update the user's jsonb column
                const { error: updateError } = await supabase
                    .from('users')
                    .update({ referralData: userJsonData }) // Update the jsonb column
                    .eq('id', userId); // Identify which user to update
    
                if (updateError) {
                    console.error('Error updating user data:', updateError.message);
                } else {
                    console.log('User data updated successfully:', userJsonData);
                    message.success(`${t("hero.message4")}`);
                }

                const { error: updateReferral } = await supabase
                    .from('users')
                    .update([{ hasReferrer: true, referrerLink: referrer }]) // Update the jsonb column
                    .eq('id', user.id); // Identify which user to update
    
                if (updateReferral) {
                    console.error('Error updating user data:', updateReferral.message);
                } else {
                    console.log(`${t("hero.message5")}`);
                }
                getReferrer();
            }
        }
    };
    
    const handleLogout = async () => {
        /* const options = {
            method: 'GET',
            url: 'https://api-football-v1.p.rapidapi.com/v3/odds',
            params: {fixture: '1208137'},
            headers: {
              'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
              'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
            }
          };
          
          
          try {
              const response = await axios.request(options);
              console.log(response.data.response);
          } catch (error) {
              console.error(error);
          } */
        setExpandedReferrals(false)
        setExpandedWallet(false)
        const { error } = await supabase.auth.signOut()
    
        if (error) {
          console.error('Error logging out:', error.message)
        } else {
          console.log('User logged out successfully')
          Swal.fire({
            title: "Log out!",
            text: "You have been disconnected",
            icon: "success"
          });
        }
    }

    const toggleProfile = () => {
        setExpandedProfile(!expandedProfile);
    };
    const toggleWallet = () => {
        if(user){
            setExpandedWallet(!expandedWallet);
        } else {
            Swal.fire({
                title: "Not logged in",
                text: "Log in to see your wallet!",
                icon: "error"
              }); 
        }
        
    };
    const toggleReferrals = () => {
        if(user){
            setExpandedReferrals(!expandedReferrals);
        } else {
            Swal.fire({
                title: "Not logged in",
                text: "Log in to see your referrals!",
                icon: "error"
              }); 
        }
    };
    const toggleLinks = () => {
        if(user){
            setExpandedLinks(!expandedLinks);
        } else {
            Swal.fire({
                title: "Not logged in",
                text: "Log in to see your referrals!",
                icon: "error"
              }); 
        }
    };

    const handleGoogleSignIn = async () => {
        
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
        })
    
        if (error) {
          console.error('Error with Google sign-in:', error.message)
        } 
        if(data){
            console.error('Google sign-in successful:', data) 
        }
    }

    const storeUserData = async (user) => {
        const { id, email, user_metadata } = user;
        const { full_name: name, avatar_url } = user_metadata || {};
        Swal.fire({
            title: "Log in successful",
            text: "Welcome to PacTON Gaming Zone!",
            icon: "success"
          });
        try {
            // Insert or update user login data
            const { error: loginError } = await supabase
                .from('user_logins')
                .upsert([{ user_id: id, email: email, name: name, avatar: avatar_url }]);
    
            if (loginError) throw loginError;
            console.log('User login data saved successfully:', { id, email, name, avatar_url });
        } catch (error) {
            console.error('Error storing user login data:', error.message);
        }
    
        try {
            // Check if user already exists in the users table
            const { data: existingUser, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('id', id)
                .limit(1); // Limit to 1 row to avoid multiple rows error
    
            // Check for errors in fetching
            if (fetchError) {
                console.error('Error checking user existence:', fetchError.message);
                return;
            }
    
            // Check if any users were returned
            if (existingUser.length === 0) {
                // If user does not exist, proceed to save data
                const { data, error } = await supabase
                    .from('users')
                    .upsert([{ 
                        id: id, // Assign the user's ID to the 'id' column
                        email: email, 
                        name: name, 
                        avatar: avatar_url, 
                        referralLink: `PACTONGZ/${id}` 
                    }]);
    
                if (error) {
                    console.error('Error storing user data:', error.message);
                    return;
                }
    
                console.log('User data saved successfully:', data);
                
            } else {
                console.log('User already exists in the database. No data saved:', existingUser);
            }
        } catch (error) {
            console.error('Unexpected error storing user data:', error.message);
        }
    };

    const getTokenBalance = async (account, provider) => {
        if (!provider) {
          console.error("Provider is undefined.");
          return;
        }
      
        // Wrap the WalletConnect provider with Web3
        const web3 = new Web3(provider);
      
        const tokenAddress = "0xf09aF67f24b49d5078C9f1F243C55F88af11D746"; // Replace with your token's contract address
      
        // ERC-20 ABI for balanceOf and decimals
        const ERC20_ABI = [
            { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "type": "function" },
            { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "type": "function" }
          ];
        
          // Create the contract instance
          const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress);
        
          try {
            // Get balance and decimals
            const balance = await tokenContract.methods.balanceOf(account).call();
            const decimals = await tokenContract.methods.decimals().call();
        
            // Convert balance and decimals to BigInt for precise calculation
            const balanceBigInt = BigInt(balance);
            const decimalsBigInt = BigInt(decimals);
            const factor = BigInt(10) ** decimalsBigInt; // Equivalent to 10^decimals
        
            // Format balance to a human-readable format (divide by the decimals factor)
            const formattedBalance = balanceBigInt / factor;
            console.log(`Token balance for ${tokenAddress}: ${formattedBalance.toString()}`);
            setMetaMaskWalletBalance(formattedBalance.toString())
            return formattedBalance.toString(); // Return as string to avoid BigInt issues elsewhere
          } catch (error) {
            console.error("Error fetching token balance:", error);
          }
    };

    async function connectMetaMask() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                // Request account access if needed
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setMetaMaskWalletAddress(accounts[0])
                Swal.fire({
                    title: "Wallet Connected!",
                    text: "Your Wallet is now connected",
                    icon: "success"
                  });
            } catch (error) {
                console.error('User denied account access', error);
            }
        } else {
            alert('MetaMask is not installed!');
        }
    }

    const connectWallet = async () => {
        try {
          // Initialize the provider with the WalletConnect projectId and chainId
          const newProvider = await EthereumProvider.init({
            projectId: '87ce01feb918e3377f943f901349cd66', // Replace with your WalletConnect projectId
            chains: [9008],
            rpcMap: {
                9008: 'https://rpc-nodes.shidoscan.com', // Add the RPC URL here
              }, // Ethereum Mainnet chainId is 1
            showQrModal: true, // This will show the QR modal for mobile connection
            metadata: {
              name: "PACTON'S GAMING ZONE",
              description: 'A New Era of Gaming and Sports Betting',
              url: "https://pacgames-frontend.onrender.com",
              icons: ['https://i.postimg.cc/XJPDxF3H/Group-2.png'],
            },
          });
    
          // Handle QR code URI display event
          newProvider.on('display_uri', (uri) => {
            console.log('Display URI:', uri);
          });
    
          // Connect to WalletConnect (this will display the QR code on mobile)
          await newProvider.connect();
          setProvider(newProvider); // Store the provider in state
    
          // Request user accounts after successful connection
          await newProvider.enable();
          const accounts = await newProvider.request({ method: "eth_requestAccounts" });
          if (accounts && accounts.length > 0) {
            setMetaMaskWalletAddress(accounts[0]); 
            getTokenBalance(accounts[0], newProvider);
            const updatedData = {
              name: user.user_metadata.name,
              avatar: user.user_metadata.avatar_url,
              email: user.email,
              walletAddress: accounts[0],
              user_id: user.id
            }
            const { data, error } = await supabase
            .from('user_wallets')
            .insert([updatedData])
            if (error) {
              console.error('Error inserting/updating user session data:', error.message)
            } else {
              console.log('User session data saved:', data)
              Swal.fire({
                title: "Wallet Connected!",
                text: "Your Wallet is now connected",
                icon: "success"
              });
            }
            
          }
    
          console.log("Connected account:", accounts[0]);
        } catch (error) {
          console.error("Error connecting wallet:", error);
        }
      };
    console.log(metaMaskWalletAddress)

  return (
    <HeroSection ref={ref}>
      
            <TopHeader>
           {toHide === false && (
            <>
                 <TopText>{t("hero.title")}<br/><span>SHO</span></TopText>
                    <motion.img src={Sho} 
                    alt="background" 
                    style={{ width: isMobile ? "40%" : '15%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} 
                    animate={controls} />
            </>
           )}
            </TopHeader>

              <TeamBetsHolder style={{width: '90%', margin: '10px 0'}}
                  initial={{ height: '80px' }}
                  animate={{ height: expandedProfile === true ? '300px' : '80px' }}
                  transition={{ duration: 0.5 }}
                  >
                    <MiniIconButton>{expandedProfile === true ? <SmallArrowDownFlex style={{ transform: 'rotate(180deg)' }} onClick={() => toggleProfile()} /> : <SmallArrowDownFlex onClick={() => toggleProfile()} />}</MiniIconButton>
                  {toHide === false && <RowerSmall><h2 style={{color: expandedProfile === true ? `${theme.MainAccentTwo}` : `${theme.MainAccent}`}}>PROFILE</h2></RowerSmall>}
                  {expandedProfile === true && (
                      <>
                        {toHide === false && (
                            <LowRower >
                            {user ? (
                                <>
                                    <AvatarRowBets>
                                    <Avatar alt="Image" src={user && user.user_metadata.avatar_url} sx={{ width: 50, height: 50 }} />        
                                    </AvatarRowBets>
                                    <RowerRowBets>
                                    <h2>{user && user.user_metadata.full_name}</h2>
                                    </RowerRowBets>
                                    <RowerRowBets>
                                    <h3>{user && user.email}</h3>
                                    </RowerRowBets>
                                    <RowerRowBets>
                                   {/*  <Switch inputProps={{ 'aria-label': 'ant design' }} checked={checked} onChange={subscribeToNotifications}/> */}
                                    </RowerRowBets>
                                    <RowerRowBets style={{ height: '70px' }}>
                                        <StyledButton onClick={subscribeToNotifications}>CONNECT</StyledButton>
                                        <StyledButton onClick={handleSendNotification}>SEND</StyledButton>
                                    </RowerRowBets>
                                </>
                            ) : (
                                <>
                                    <AvatarRowBets>
                                    <Avatar alt="Image" src={user && user.user_metadata.avatar_url} sx={{ width: 50, height: 50 }} />        
                                    </AvatarRowBets>
                                    <RowerRowBets></RowerRowBets>
                                    <RowerRowBets style={{ height: '70px' }} onClick={() => handleGoogleSignIn()}><WalletsRow>
                                    {theme.body === '#202020' ? <img src={googleDark} alt="googleDark" /> : <img src={googleLight} alt="googleLight" />}
                                    </WalletsRow></RowerRowBets>
                                    <RowerRowBets></RowerRowBets>
                                    <RowerRowBets></RowerRowBets>
                                </>
                                
                            )}
                                
                          </LowRower>
                        )}
                      </>
                  )}
              </TeamBetsHolder>

              <TeamBetsHolder style={{ width: '90%', margin: '10px 0'}}
                  initial={{ height: '80px' }}
                  animate={{ height: expandedWallet === true ? '380px' : '80px' }}
                  transition={{ duration: 0.5 }}
                  >
                    <MiniIconButton>{expandedWallet === true ? <SmallArrowDownFlex style={{ transform: 'rotate(180deg)' }} onClick={() => toggleWallet()} /> : <SmallArrowDownFlex onClick={() => toggleWallet()} />}</MiniIconButton>
                  {toHide === false && <RowerSmall><h2 style={{color: expandedWallet === true ? `${theme.MainAccentTwo}` : `${theme.MainAccent}`}}>WALLETS</h2></RowerSmall>}
                  {expandedWallet === true && (
                      <>
                        {toHide === false && (
                            <LowRower >
                            <RowerRowBets>
                            <h2>BALANCE: <span>{typeof balance === 'number' && !isNaN(balance) ? parseFloat(balance.toFixed(2)) : '0.00'} PGZ</span>
                            </h2>
                            </RowerRowBets>
                            <AvatarRowBets><h2>CONNECT YOUR WALLET HERE</h2></AvatarRowBets>
                            {!metaMaskWalletAddress ? (
                                <>
                                    {isDesktop ? (
                                        <WalletsRow onClick={connectWallet}>
                                            {metaMaskWalletAddress !== null ? (
                                                <LinkInputField readOnly value={metaMaskWalletAddress} onClick={() => disconnectWallet()}/>
                                            ) : (
                                                <img src={metamask} alt="connect" style={{width: '30%'}}/>
                                            )}
                                        </WalletsRow>
                                        
                                    ) : (
                                        <WalletsRow onClick={connectWallet}><img src={connect} alt="connect" /></WalletsRow>
                                    )}
                                </>
                            ) : (
                                <>
                                <RowerRowBets>
                                    <h2>CONNECTED ADDRESS</h2>
                                </RowerRowBets>
                                <RowerRowBets>
                                    <LinkInputField readOnly value={metaMaskWalletAddress} onClick={() => disconnectWallet()}/>
                                </RowerRowBets>
                                </>
                            )}
                            <WalletsRow><TonConnectButton /></WalletsRow>
                  </LowRower>
                        )}
                      </>
                  )}
              </TeamBetsHolder>

              <TeamBetsHolder style={{  width: '90%', margin: '10px 0'}}
                  initial={{ height: '80px' }}
                  animate={{ height: expandedLinks === true ? '440px' : '80px' }}
                  transition={{ duration: 0.5 }}
                  >
                    <MiniIconButton>{expandedLinks === true ? <SmallArrowDownFlex style={{ transform: 'rotate(180deg)' }} onClick={() => toggleLinks()} /> : <SmallArrowDownFlex onClick={() => toggleLinks()} />}</MiniIconButton>
                  <RowerSmall><h2 style={{color: expandedLinks === true ? `${theme.MainAccentTwo}` : `${theme.MainAccent}`}}>LINKS</h2></RowerSmall>
                  {expandedLinks === true && (
                    <>
                  <LowRower >
                      <RowerRowBets>
                          <h2>{t("hero.title3")}</h2>
                      </RowerRowBets>
                      <RowerRowBets>
                          <LinkInputField disabled={disabledInput} value={referrerValue} onChange={(e) => setReferrerValue(e.target.value)} id="referrerLink" />
                      </RowerRowBets>
                      <IconsRow><IconButton onClick={sendLink}><Send /></IconButton></IconsRow>
                      <RowerRowBets>
                          <h2>{t("hero.title4")}</h2>
                      </RowerRowBets>
                      <RowerRowBets>
                          <LinkInputField disabled={true} id="referralLink" value={`PACTONGZ/${user.id}`} />
                      </RowerRowBets>
                      <IconsRow><IconButton onClick={clipboard}><CopyClipboard /></IconButton></IconsRow>
                  </LowRower >
                  </>
                      
                  )}
              </TeamBetsHolder>

              <TeamBetsHolder style={{ width: '90%', margin: '10px 0 50px 0'}}
                  initial={{ height: '80px' }}
                  animate={{ height: expandedReferrals === true ? '330px' : '80px' }}
                  transition={{ duration: 0.5 }}
                  >
                    <MiniIconButton>{expandedReferrals === true ? <SmallArrowDownFlex style={{ transform: 'rotate(180deg)' }} onClick={() => toggleReferrals()} /> : <SmallArrowDownFlex onClick={() => toggleReferrals()} />}</MiniIconButton>
                  <RowerSmall><h2 style={{color: expandedReferrals === true ? `${theme.MainAccentTwo}` : `${theme.MainAccent}`}}>REFERRALS</h2></RowerSmall>
                  {expandedReferrals === true && (
                    <LowRower>
                       {referrals?.map((referral) => {
                        return(
                            <ReferralWrapper>
                            <SecondRowAvatar><Avatar alt="Image" src={referral.avatar} sx={{ width: 50, height: 50 }} /></SecondRowAvatar>
                            <ReferralName>{referral.name}</ReferralName>
                            </ReferralWrapper> 
                        )
                       })}
                    </LowRower>
                  )}
              </TeamBetsHolder>
        {/* <Header>
        <ContainerTitle><Avatar onClick={handleLogout} alt="Image" src={user && user.user_metadata.avatar_url} sx={{ width: 50, height: 50 }} /></ContainerTitle>
        <ContainerSamllTitle></ContainerSamllTitle>
        <ContainerSamllTitle>{user && user.email}</ContainerSamllTitle>
        <ContainerSamllTitle></ContainerSamllTitle>
        <ContainerSamllTitle >BALANCE: <span style={{color: 'aqua', margin: '0 5px'}}>{parseFloat(balance?.toFixed(2))} PGZ</span></ContainerSamllTitle>
        
        <ContainerSamllTitle></ContainerSamllTitle>
        <ContainerSamllTitle>{t("hero.title2")}</ContainerSamllTitle>
        <ContainerSamllTitle>{date}</ContainerSamllTitle>
        </Header>
      <Header initial={{ height: '320px' }} // Initial height
                animate={{ height: isExpanded ? 'auto' : '320px' }}
                exit={{ opacity: 0, height: 0 }} // Height transitions between 100px and 300px
                transition={{ duration: 0.5 }} style={{overflow: 'hidden'}} isExpanded={isExpanded}>
            <ContainerButtons>
            <ContainerTitle>{t("hero.title3")}</ContainerTitle>
            
                    {user && <LinkInputField disabled={disabledInput} value={referrerValue} onChange={(e) => setReferrerValue(e.target.value)} id="referrerLink"/>} <IconButton onClick={sendLink}><Send /></IconButton>
            </ContainerButtons>
            <ContainerButtons>
            <ContainerTitle>{t("hero.title4")}</ContainerTitle>
           
                    {user && <LinkInputField disabled={true} id="referralLink" value={`PACTONGZ/${user.id}`}/>} <IconButton onClick={clipboard}><CopyClipboard /></IconButton>
            </ContainerButtons>
            {isExpanded && (
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <ContainerTitle>{t("hero.title5")}</ContainerTitle>
                        {referrals?.map((referral) => {
                            console.log(referral)
                            return(
                                <ReferralWrapper>
                                    <SecondRowAvatar><Avatar alt="Image" src={referral.avatar} sx={{ width: 50, height: 50 }} /></SecondRowAvatar>
                                    <ReferralName>{referral.name}</ReferralName>
                                    <ReferralMail>{referral.email}</ReferralMail>
                                </ReferralWrapper>
                            )
                        })}
                    </div>
                )}   
                {(referrals.length > 0 && !isExpanded) && <MiniArrowDown onClick={expandDiv}/> } 
                {(referrals.length > 0 && isExpanded) && <MiniArrowup onClick={expandDiv}/> } 
      </Header> */}
      
    </HeroSection>
  )
}

export default Hero

const ReferralName = styled.div`
    width: 40%;
    height: 100%;
    ${props => props.theme.displayFlex};
    color: ${props => props.theme.text};
    font-size: 24px;
    text-align: center;
    padding: 0 10px;
    font-weight: bold;
    @media(max-width: 968px){
        font-size: 16px;
        
    }
`;

const ReferralMail = styled.div`
    width: 40%;
    height: 100%;
    ${props => props.theme.displayFlex};
    color: rgba(244,215,21,1);
    font-size: 24px;
    text-align: center;
    padding: 0 10px;
    font-weight: bold;
    white-space: nowrap;      /* Prevents text from wrapping to the next line */
    overflow: hidden;         /* Ensures content that overflows the container is hidden */
    text-overflow: ellipsis;
    @media(max-width: 968px){
        font-size: 16px;
        width: 35%;
    }
`;

const SecondRowAvatar = styled.div`
    width: 25%;
    height: 100%;
    border-right: 1px solid ${props => props.theme.MainAccent};
    ${props => props.theme.displayFlexColumnCenter};
`;

const ReferralWrapper = styled.div`
    width: 100%;
    height: 60px;
    border: 1px solid ${props => props.theme.MainAccent};
    border-radius: 10px;
    ${props => props.theme.displayFlex};
    margin: 10px 0;
`;

const TopHeader = styled.div`
    width: 90%;
    max-height: 220px;
    border: 1px solid ${props => props.theme.MainAccent};
    border-radius: 10px;
    position: relative;
    ${props => props.theme.displayFlexCenter};
    background: ${props => props.theme.card};
    margin: 10px;
    padding: 10px;
    padding-bottom: ${({ isExpanded }) => (isExpanded ? "30px" : "10px")};
    box-shadow: ${props => props.theme.pacBoxShadow}, inset 0 0 25px ${props => props.theme.text};
    @media(max-width: 490px){
        min-height: 150px;
    }
`;

const TopText = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    width: 70%;
    text-align: center;
    color: ${props => props.theme.MainAccent};
    font-size: 32px;
    font-weight: bold;
    z-index: 10;
    transform: translate(-50%, -50%);
    span{
        font-size: 48px; 
        color: ${props => props.theme.text};
    }
    @media(max-width: 968px){
        font-size: 18px;
    }
`;

const Header = styled(motion.div)`
    width: 90%;
    min-height: 320px;
    border: 1px solid rgba(244,215,21,1);
    border-radius: 10px;
    position: relative;
    margin: 10px;
    padding: 10px;
    padding-bottom: ${({ isExpanded }) => (isExpanded ? "30px" : "10px")};
    background: ${props => props.theme.cardTwo};
    box-shadow: inset 0 0 25px ${props => props.theme.text};
`;

const ContainerTitle = styled.div`
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: ${props => props.theme.pacColor};
    //${props => props.theme.pacfont};
    font-size: 20px;
    letter-spacing: 3;
    font-weight: bold;
`;

const ContainerSamllTitle = styled.div`
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.pacColor};
    //${props => props.theme.pacfont};
    font-size: 16px;
    letter-spacing: 3;
    font-weight: bold;
`;


const ContainerButtons = styled.div`
    width: 100%;
    height: 150px;
    ${props => props.theme.displayFlexColumn};
`;

const LinkInputField = styled.input`
  padding: 0 15px;
  font-weight: bold;
  border: ${props => props.theme.MainAccent};
  border-radius: 10px;
  outline: none;
  font-size: 14px;
  color: ${props => props.theme.MainAccent};
  background-color: transparent;
  box-shadow: -2px 4px 8px rgb(255, 255, 255);
  width: 90%;
  z-index: 1;
  height: 40px;
  text-align: center;
  user-select: none;
`;

const CopyClipboard = styled(ContentCopyRoundedIcon)`
    &&&{
        margin: 10px;
        color: ${props => props.theme.copyIcon};
    }
`;
const Send = styled(SendIcon)`
    &&&{
        margin: 10px;
        color: ${props => props.theme.copyIcon};
    }
`;

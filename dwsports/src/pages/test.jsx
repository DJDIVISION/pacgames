<SmartNav scrollNavDown={scrollNavDown}>
    <IconButton onClick={isOpen}><Burguer /></IconButton>
    <TonConnectButton />
    {open && (
        <AnimatePresence>
        <StyledMenu scrollNavDown={scrollNavDown} variants={item} 
        initial="initial"
        animate="animate"
        exit="exit">
        <IconButton onClick={isOpen}><CloseBurguer /></IconButton>
        <StaggerContainer initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.3 },
                },
              }}>
                          <LinkR to="/bets"><StaggerRow initial={{ opacity: 0, y: 40 }} 
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.7 }} >
                              <StaggerImageHolder><img src={sportsIcon} alt="sports" /></StaggerImageHolder>
                              <StaggerAvatarName>{t("navbar.sports")}</StaggerAvatarName>
                          </StaggerRow></LinkR>
                          <LinkR to="/fantasy"><StaggerRow initial={{ opacity: 0, y: 40 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.9 }} >
                              <StaggerImageHolder><img src={fantasy} alt="fantasy" /></StaggerImageHolder>
                              <StaggerAvatarName>{t("navbar.fantasy")}</StaggerAvatarName>
                          </StaggerRow></LinkR>
                          <LinkR to="/casino"><StaggerRow initial={{ opacity: 0, y: 40 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 1.1 }} >
                              <StaggerImageHolder><img src={chip} alt="casino" /></StaggerImageHolder>
                              <StaggerAvatarName>CASINO</StaggerAvatarName>
                          </StaggerRow></LinkR>
                          <StaggerRow initial={{ opacity: 0, y: 40 }} onClick={() => setDepositMenu(true)}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 1.3 }} >
                              <StaggerImageHolder><img src={deposit} alt="fantasy" /></StaggerImageHolder>
                              <StaggerAvatarName>{t("navbar.deposit")}</StaggerAvatarName>
                          </StaggerRow>
                          <StaggerRow initial={{ opacity: 0, y: 40 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 1.5 }}> 
                          <StaggerImageHolder>
                          {theme === 'dark' ? <LightIcon onClick={toggleTheme}/> : <DarkIcon onClick={toggleTheme}/>}
                          </StaggerImageHolder>
                          <StaggerAvatarName>{t("navbar.switch")}</StaggerAvatarName>
                          </StaggerRow>
                      </StaggerContainer>
                  </StyledMenu>
                  {depositMenu && (
                    <DepositMenu depositMenu={depositMenu} setDepositMenu={setDepositMenu} />
                  )}
                  <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'fixed', bottom: 30, left: 30 }}
        icon={<Language />}
      >
       {languages.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
                  </AnimatePresence>
                  
        )}
        </SmartNav>


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
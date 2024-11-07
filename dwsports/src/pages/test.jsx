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
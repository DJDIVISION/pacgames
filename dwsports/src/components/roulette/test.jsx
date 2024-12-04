<>
<ZeroRowBets key="#7">
                        <HalfZeroRowBets style={{height: '60%'}} key="#8"></HalfZeroRowBets>
                        <HalfZeroRowBets style={{height: '40%'}} key="#9">
                        <EmptySpace key="#10">
                        {seconds && (
                            <>
                                <motion.div key="#11" variants={item}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit">
                                    <BigNumberContainer key="#12" style={{ background: seconds > 3 ? '#71f53dd6' : '#fa0606da' }}>
                                    {seconds} 
                                    </BigNumberContainer>
                                </motion.div>
                                
                            </>
                        )}    
                        </EmptySpace>   
                        <ColumnHolder key="#13">
                            {Zeroes.map((card, index) => {
                                return (
                                    <ZeroesArea activeNumbers={activeNumbers} card={card} key={index} allDroppedChips={allDroppedChips} setAllDroppedChips={setAllDroppedChips} activeContainer={activeContainer}/>
                                )
                            })}
                        </ColumnHolder>
                        </HalfZeroRowBets>
                    </ZeroRowBets>
                    <LeagueRowBets key="#14">
                
                <FirstColumn key="#15">
                            {LastRow.map((card, index) => {
                                return (
                                    <LastRowArea card={card} key={index} droppedLastRowChips={droppedLastRowChips} setDroppedLastRowChips={setDroppedLastRowChips} removeBet={removeBet}/>
                                )
                            })}
                </FirstColumn>
                <FirstColumn key="#16">
                            {BetPerRows.map((card, index) => {
                                return (
                                    <BetPerRowsArea card={card} key={index} droppedRowChips={droppedRowChips} setDroppedRowChips={setDroppedRowChips} removeBet={removeBet}/>
                                )
                            })}
                </FirstColumn>
                <FirstColumn key="#17">
                            {ThirdRow.map((card, index) => {
                                return (
                                    <BetNumbersArea key={index} activeContainer={activeContainer} 
                                    card={card} onLeave={handleLeave} droppedChips={droppedChips} setDroppedChips={setDroppedChips} droppedCornerChips={droppedCornerChips} setDroppedCornerChips={setDroppedCornerChips} 
                                    droppedBorderLeftChips={droppedBorderLeftChips} setDroppedBorderLeftChips={setDroppedBorderLeftChips} droppedBorderTopChips={droppedBorderTopChips} setDroppedBorderTopChips={setDroppedBorderTopChips} 
                                    removeBet={removeBet} activeNumbers={activeNumbers}
                                    />
                                )
                            })}
                </FirstColumn>
                <FirstColumn key="#18">
                            {SecondRowNoZeroes.map((card, index) => {
                                return (
                                    <BetNumbersArea key={index} activeContainer={activeContainer} 
                                    card={card} onLeave={handleLeave} droppedChips={droppedChips} setDroppedChips={setDroppedChips} droppedCornerChips={droppedCornerChips} setDroppedCornerChips={setDroppedCornerChips} 
                                    droppedBorderLeftChips={droppedBorderLeftChips} setDroppedBorderLeftChips={setDroppedBorderLeftChips} droppedBorderTopChips={droppedBorderTopChips} setDroppedBorderTopChips={setDroppedBorderTopChips} 
                                    removeBet={removeBet} activeNumbers={activeNumbers}
                                    />
                                )
                            })}
                </FirstColumn>
                <FirstColumn key="#19">
                            {FirstRowNoZeroes.map((card, index) => {
                                return (
                                    <BetNumbersArea key={index} activeContainer={activeContainer} 
                                    card={card} onLeave={handleLeave} droppedChips={droppedChips} setDroppedChips={setDroppedChips} droppedCornerChips={droppedCornerChips} setDroppedCornerChips={setDroppedCornerChips} 
                                    droppedBorderLeftChips={droppedBorderLeftChips} setDroppedBorderLeftChips={setDroppedBorderLeftChips} droppedBorderTopChips={droppedBorderTopChips} setDroppedBorderTopChips={setDroppedBorderTopChips} 
                                    removeBet={removeBet} activeNumbers={activeNumbers}
                                    />
                                )
                            })}
                </FirstColumn>
              </LeagueRowBets>
              <ColumnBets key="#20">
                        <EmptySpace key="#21"></EmptySpace>
                        <ColumnHolder key="#22">
                            {BetPerColumns.map((card, index) => {
                                return (
                                    <BetPerColumnsArea card={card} key={index} droppedColumnChips={droppedColumnChips} setDroppedColumnChips={setDroppedColumnChips} removeBet={removeBet}/>
                                )
                            })}
                        </ColumnHolder>
                        </ColumnBets>

                        <ChipsHolder key="#23">
                                <ChipsTwo key="#24"/>
                        </ChipsHolder>
</>
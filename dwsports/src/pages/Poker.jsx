import React, { Component } from 'react'
import './Poker.css'
import {TeamStatsSection} from './index.jsx'
import Player from '../components/players.jsx/Player'
import ShowdownPlayer from '../components/players.jsx/ShowdownPlayer'
import Card from '../components/cards/Card'
import { generateDeckOfCards,shuffle,dealPrivateCards } from '../utils/cards'
import { generateTable,beginNextRound,checkWin } from '../utils/players'
import { determineBlindIndices, anteUpBlinds,determineMinBet,handleBet,handleFold} from '../utils/bet.jsx'
import {handleAI as handleAIUtil} from '../utils/ai.jsx';
import {renderShowdownMessages,renderActionButtonText,renderNetPlayerEarnings,renderActionMenu} from '../utils/ui.jsx';
import { cloneDeep } from 'lodash';

export default class Poker extends Component {

    state = {
        loading: true,
        winnerFound: null,
        players: null,
        numPlayersActive: null,
        numPlayersFolded: null,
        numPlayersAllIn: null,
        activePlayerIndex: null,
        dealerIndex: null,
        blindIndex: null,
        deck: null,
        communityCards: [],
        pot: null,
        highBet: null,
        betInputValue: null,
        sidePots: [],
        minBet: 20,
        phase: 'loading',
        playerHierarchy: [],
        showDownMessages: [],
        playActionMessages: [],
        playerAnimationSwitchboard: {
          0: {isAnimating: false, content: null},
          1: {isAnimating: false, content: null},
          2: {isAnimating: false, content: null},
          3: {isAnimating: false, content: null},
          4: {isAnimating: false, content: null},
          5: {isAnimating: false, content: null}
        }
      }
    
    cardAnimationDelay = 0;

    async componentDidMount() {
      const players = await generateTable();
      const dealerIndex = Math.floor(Math.random() * Math.floor(players.length));
      const blindIndicies = determineBlindIndices(dealerIndex, players.length);
      const playersBoughtIn = anteUpBlinds(players, blindIndicies, this.state.minBet);
      const imageLoaderRequest = new XMLHttpRequest();
      imageLoaderRequest.addEventListener("error", e => {
        console.log(`${e.type}`);
        console.log(e);
      });
      
      
      imageLoaderRequest.addEventListener("loadstart", e => {
          console.log(`${e.type}`);
          console.log(e);
      });
      
      imageLoaderRequest.addEventListener("loadend", e => {
          console.log(`${e.type}`);
          console.log(e);
      });
      
      imageLoaderRequest.addEventListener("abort", e => {
          console.log(`${e.type}`);
          console.log(e);
      });
      
      imageLoaderRequest.addEventListener("progress", e => {
          console.log(`${e.type}`);
          console.log(e);
      });

      imageLoaderRequest.open("GET", "./assets/table-nobg-svg-01.svg");
      imageLoaderRequest.send();

      this.setState(prevState => ({
        // loading: false,
        players: playersBoughtIn,
        numPlayersActive: players.length,
        numPlayersFolded: 0,
        numPlayersAllIn: 0,
        activePlayerIndex: dealerIndex,
        dealerIndex,
        blindIndex: {
          big: blindIndicies.bigBlindIndex,
          small: blindIndicies.smallBlindIndex,
        },
        deck: shuffle(generateDeckOfCards()),
        pot: 0,
        highBet: prevState.minBet,
        betInputValue: prevState.minBet,
        phase: 'initialDeal',
      }))
      this.runGameLoop();
    }

    runGameLoop = () => {
      const newState = dealPrivateCards(cloneDeep(this.state))
      this.setState(newState, () => {
        if((this.state.players[this.state.activePlayerIndex].robot) && (this.state.phase !== 'showdown')) {
          setTimeout(() => {
            this.handleAI()
          }, 1200)
        }
      })
    }

      

  render() {
    return (
      <TeamStatsSection>
        
      </TeamStatsSection>
    )
  }
}

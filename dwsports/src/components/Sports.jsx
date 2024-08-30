import React, {useEffect,useState,useRef} from 'react'
import {sportsData,SportsCarousel,InnerSportsCarousel, SportIcon, SportName, SportWrapper,item} from './index'
import axios from 'axios'
import {motion} from 'framer-motion'
import { BetState } from '../context/BetsContext'


const Sports = ({activeSportMenu,setActiveSportMenu,activeCountryMenu,setActiveCountryMenu}) => {

    const [width, setWidth] = useState(0);
    const carroussel = useRef();
    const {activeSport, setActiveSport} = BetState();
    const {activeCountry, setActiveCountry} = BetState();
    const {activeLeague, setActiveLeague} = BetState();
    

    useEffect(() => {
        //console.log(carroussel.current.scrollWidth, carroussel.current.offsetWidth);
        setWidth(carroussel.current.scrollWidth - carroussel.current.offsetWidth);
    }, [])

    const setSport = (el) => {
        setActiveSport(el.title)
        setActiveSportMenu(false)
        setActiveCountryMenu(true)
    }

  return (
    <motion.div className="menu-container-four" variants={item}
          initial={{height:0,opacity:0}}
          animate={{height:'100%', opacity:1}}
          transition={{duration:.5}}
          exit="exit"
          style={{border: `1px solid ${props => props.theme.text}`}}>
    
      <SportsCarousel ref={carroussel}>
        <InnerSportsCarousel drag="x" dragConstraints={{right: 0, left: -width}} whileTap={{cursor: 'grabbing'}}>
               {sportsData.map(el => {
                return(
                    <SportWrapper key={el.name} whileTap={{scale: 0.95}} onClick={() => setSport(el)}>
                        <SportIcon><img src={el.icon} alt={`${el.name} icon`} /></SportIcon>
                        <SportName>{el.name}</SportName>
                    </SportWrapper>
                )
               })} 
        </InnerSportsCarousel>
      </SportsCarousel>
    
    </motion.div>
  )
}

export default Sports

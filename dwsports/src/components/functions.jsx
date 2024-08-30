import React,{useState,useRef,useEffect} from "react";
import axios from 'axios';

export const setSportsCarrousselWidth = () => {

    const [width, setWidth] = useState();
    const sportsCarroussel = useRef();

    useEffect(() => {
        const getWidth = () => {
            if(sportsCarroussel.current === undefined){
                setWidth(0)
            } else {
                setWidth(sportsCarroussel.current.scrollWidth - sportsCarroussel.current.offsetWidth);
            }
        };
        getWidth();
    }, [sportsCarroussel]);

    return { sportsCarroussel, setWidth, width}
}

export const useFetchSports = async () => {
    const [sports, setSports] = useState([])
    const [sportsLoading, setSportsLoading] = useState(false)

    const sp = localStorage.getItem("sports")
    const options = {
        method: 'GET',
        url: 'https://pinnacle-odds.p.rapidapi.com/kit/v1/sports',
        headers: {
          'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
          'x-rapidapi-host': 'pinnacle-odds.p.rapidapi.com'
        }
      };
      const fetchSports = async () => {
        setSportsLoading(true)
        console.log(sp)
        if(sp === null){
            try {
                const response = await axios.request(options);
                setSports(response.data);
                const str = JSON.stringify(str)
                localStorage.setItem("sports", str)
              } catch (error) {
                  console.error(error);
              }
              setSportsLoading(false) 
        } else {
            console.log(sp)
            const sports = JSON.parse(sp)
            setSports(sports)
            setSportsLoading(false)
        }
      }
      
    return {sports, sportsLoading, fetchSports}
}
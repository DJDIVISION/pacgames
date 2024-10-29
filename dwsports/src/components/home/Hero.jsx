import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components'
import { motion, useTransform, useScroll, useAnimation } from 'framer-motion';
import {HeroSection} from './index'
import Ton from '../../assets/logos/ton.png'
import { useAuth } from '../../pages/functions';
import { message } from 'antd';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import SendIcon from '@mui/icons-material/Send';
import { Avatar, Button, IconButton } from '@mui/material';
import { supabase } from '../../supabase/client';

const Hero = () => {

    const ref = useRef(null);
    const { user } = useAuth(); 
    const [disabledInput, setDisabledInput] = useState(false)
    const [referrerValue, setReferrerValue] = useState("")
    const [referrals, setReferrals] = useState([])
    const [isExpanded, setIsExpanded] = useState(true)
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const textScale = useTransform(scrollYProgress, [0, 0.5], [1.7, 1]);
    const imageTopScale = useTransform(scrollYProgress, [0, 0.5], [1.2, 0.9]);
    const textY = useTransform(scrollYProgress, [0, 0.5], ["3vh", "40vh"]); // Moves downward
    const textOpacity = useTransform(scrollYProgress, [0.4, 0.6], [1, 0]); // Fades out closer to the image
    const imageOpacity = useTransform(scrollYProgress, [0.6, 0.4], [1, 0]); 
    // Define scale and position for image
    const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.65]);
    const imageY = useTransform(scrollYProgress, [0, 1], [10, 50]);
    const controls = useAnimation();

    const expandDiv = () => {
        setIsExpanded(!isExpanded)
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
            console.log(data)
            if(data[0].hasReferrer === true){
                setDisabledInput(true)
                setReferrerValue(data[0].referrerLink)
            }
            if(data[0].referralData !== null){
                setReferrals(data[0].referralData.referrals)
            }
        }
    }

    console.log(referrals)

    

    useEffect(() => {
        if(user){
            getReferrer();
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
        // Start the animation sequence on component mount
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
            message.error("You can not link another referrer!")
            return
        }
        const referral = document.getElementById("referralLink").value;
        const referrer = document.getElementById("referrerLink").value;
    
        if (referral === referrer) {
            message.error("Both links are the same!");
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
                message.error("This user does not exist in our database");
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
                    message.success("Referrer linked successfully!");
                }

                const { error: updateReferral } = await supabase
                    .from('users')
                    .update([{ hasReferrer: true, referrerLink: referrer }]) // Update the jsonb column
                    .eq('id', user.id); // Identify which user to update
    
                if (updateReferral) {
                    console.error('Error updating user data:', updateReferral.message);
                } else {
                    console.log("User data updated successfully!");
                }
                getReferrer();
            }
        }
    };
    


  return (
    <HeroSection ref={ref}>
        {/* <motion.div 
        style={{ scale: imageTopScale, y: textY, position: 'absolute', top: '0', left: '0', zIndex: 1, 
        width: '100%', height: '20vh', display: 'flex', alignItems: 'center'}}>
      <motion.img src={Ton} 
                alt="background" 
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }} 
                animate={controls} />
      </motion.div> */}
      <Header initial={{ height: 300 }} // Initial height
                animate={{ height: isExpanded ? 'auto' : 300 }} // Height transitions between 100px and 300px
                transition={{ duration: 0.5 }}>
      <ContainerButtons>
            <ContainerTitle>YOUR REFERRER LINK</ContainerTitle>
            
                    {user && <LinkInputField disabled={disabledInput} value={referrerValue} onChange={(e) => setReferrerValue(e.target.value)} id="referrerLink"/>} <IconButton onClick={sendLink}><Send /></IconButton>
            </ContainerButtons>
            <ContainerButtons>
            <ContainerTitle>YOUR REFERRAL LINK</ContainerTitle>
           
                    {user && <LinkInputField disabled={true} id="referralLink" value={`PACTONGZ/${user.id}`}/>} <IconButton onClick={clipboard}><CopyClipboard /></IconButton>
            </ContainerButtons>
            {isExpanded && (
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        {referrals?.map((referral) => {
                            console.log(referral)
                            return(
                                <ReferralWrapper>
                                    <SecondRowAvatar><Avatar alt="Image" src={referral.avatar} sx={{ width: 50, height: 50 }} /></SecondRowAvatar>
                                    <ReferralName>{referral.name}</ReferralName>
                                    <ReferralName>{referral.email}</ReferralName>
                                </ReferralWrapper>
                            )
                        })}
                    </div>
                )}    
      </Header>
    </HeroSection>
  )
}

export default Hero

const ReferralName = styled.div`
    width: 40%;
    height: 100%;
    ${props => props.theme.displayFlex};
    color: rgba(244,215,21,1);
    font-size: 24px;
    padding: 0 20px;
`;

const SecondRowAvatar = styled.div`
    width: 10%;
    height: 100%;
    border-right: 1px solid rgba(244,215,21,1);
    ${props => props.theme.displayFlexColumnCenter};
`;

const ReferralWrapper = styled.div`
    width: 90%;
    height: 80px;
    border: 1px solid rgba(244,215,21,1);
    border-radius: 10px;
    ${props => props.theme.displayFlex};
    margin: 10px 0;
`;

const Header = styled(motion.div)`
    width: 90%;
    min-height: 300px;
    border: 1px solid white;
`;

const ContainerTitle = styled.div`
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.pacColor};
    //${props => props.theme.pacfont};
    font-size: 1.9rem;
    letter-spacing: 3;
`;

const ContainerButtons = styled.div`
    width: 100%;
    height: 150px;
    ${props => props.theme.displayFlexColumn};
`;

const LinkInputField = styled.input`
  padding: 0 15px;
  border: ${props => props.theme.pacBorder};
  border-radius: 10px;
  outline: none;
  font-size: 14px;
  color: ${props => props.theme.pacColor};
  background-color: transparent;
  box-shadow: -2px 4px 8px rgb(255, 255, 255);
  width: 320px;
  z-index: 4000;
  height: 40px;
  text-align: center;
  user-select: none;
`;

const CopyClipboard = styled(ContentCopyRoundedIcon)`
    &&&{
        margin: 10px;
        color: ${props => props.theme.MainAccent};
    }
`;
const Send = styled(SendIcon)`
    &&&{
        margin: 10px;
        color: ${props => props.theme.MainAccent};
    }
`;

import {useEffect,useState} from 'react';
import {localDay} from '../lib/dates.mjs';
// Recheck after local midnight or returning to a suspended tab. No polling.
export default function useLocalDay(){const[day,setDay]=useState(localDay());useEffect(()=>{let timer:ReturnType<typeof setTimeout>;const check=()=>{setDay(localDay());const now=new Date(),next=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1);timer=setTimeout(check,next.getTime()-now.getTime()+20);};const visible=()=>{if(!document.hidden){clearTimeout(timer);check();}};check();document.addEventListener('visibilitychange',visible);return()=>{clearTimeout(timer);document.removeEventListener('visibilitychange',visible);};},[]);return day;}

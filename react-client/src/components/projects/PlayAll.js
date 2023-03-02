import * as React from "react"
import {setSectionToPlay,setTryToStart,setPlayAllStarted} from "../../features/projects/playAllSlice"
import { useDispatch, useSelector } from "react-redux";

export default function PlayAll() {

    const dispatch = useDispatch()

    const { playAllStarted, finished} = useSelector( state=>state.playAll)
    const started = React.useRef(false)

    React.useEffect(()=>{
        if ( !started.current && playAllStarted ) {
            dispatch(setTryToStart(true))
            dispatch(setSectionToPlay(0))
            started.current = true
        }
    },[playAllStarted,started,dispatch])

    React.useEffect( ()=>{
        if (finished) {
            started.current = false;
            dispatch(setTryToStart(false))
            dispatch(setSectionToPlay(-1))
            dispatch(setPlayAllStarted(false))
        }
    },[finished, dispatch])
 
}
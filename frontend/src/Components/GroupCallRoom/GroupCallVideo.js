import { useEffect, useRef } from "react";

const styles = {
    videoContainer : {
        width: '300px',
        height: '300px'
    },
    videoElement : {
        width: '100%',
        height: '100%'
    }
}

const GroupCallVideo = ({ stream }) => {
    const videoRef = useRef();

    useEffect(()=>{
        const remoteGroupCallVideo = videoRef.current;
        remoteGroupCallVideo.srcObject = stream;

        // for some browser autoPlay property on video element will not work, so, explicitely defining here the same
        remoteGroupCallVideo.onloadedmetadata = () =>{
            remoteGroupCallVideo.play();
        }
    }, [stream])


    return(
        <div style={styles.videoContainer}>
            <video ref={videoRef} autoPlay style={styles.videoElement} />
        </div>
    )
}

export default GroupCallVideo;
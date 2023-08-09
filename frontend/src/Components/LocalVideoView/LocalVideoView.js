import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const styles = {
    videoContainer : {
        width: '150px',
        height: '150px',
        borderRadious: '8px',
        position: 'absolute',
        top: '5%',
        right: '23%'
    },
    videoElement : {
        width: '100%',
        height: '100%'
    }
}

const LocalVideoView = () => {
    const localStream = useSelector((state)=> state.call.localStream);
    const localVideoRef = useRef();

    useEffect(()=>{
        if(localStream){
            const localVideo = localVideoRef.current;
            localVideo.srcObject = localStream;

            // for some browser autoPlay applied on element will not work, so explicietely adding it, to start the video manually 
            localVideo.onloadedmetadata = () => {
                localVideo.play();
            }
        }
    }, [localStream])

    return (
        <div style={styles.videoContainer} className="background_secondary_color">
            <video style={styles.videoElement}  ref={localVideoRef} autoPlay muted ></video>
            {/* this video is muted, as we don't want to hear ourself */}
        </div>
    );
}

export default LocalVideoView;
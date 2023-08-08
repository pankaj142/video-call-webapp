import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const styles = {
    videoContainer : {
        width: '100%',
        height: '100%',
    },
    videoElement : {
        width: '100%',
        height: '100%'
    }
}

const RemoteVideoView = () => {
    const remoteStream = useSelector((state)=> state.call.remoteStream);
    const remoteVideoRef = useRef();

    useEffect(()=>{
        if(remoteStream){
            const remoteVideo = remoteVideoRef.current;
            remoteVideo.src = remoteStream;

            // for some browser autoPlay applied on element will not work, so explicietely adding it, to start the video manually 
            remoteVideo.onloadedmetadata = () => {
                remoteVideo.play();
            }
        }
    }, [remoteStream])

    return (
        <div style={styles.videoContainer} >
            <video style={styles.videoElement}  ref={remoteVideoRef} autoPlay ></video>
            {/* this video is not muted */}
        </div>
    );
}

export default RemoteVideoView;
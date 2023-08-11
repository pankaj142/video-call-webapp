import { useEffect, useRef } from "react";

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

const RemoteVideoView = ({remoteStream}) => {
    const remoteVideoRef = useRef();
    useEffect(()=>{
        if(remoteStream){
            const remoteVideo = remoteVideoRef.current;
            remoteVideo.srcObject = remoteStream;

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
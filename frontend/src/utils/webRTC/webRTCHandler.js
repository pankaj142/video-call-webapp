
import { store } from "../../store/store";
import { setLocalStream } from "../../store/slices/callSlice";

const configuration = {
    'video' : true,
    'audio' : true
}

// get access to cameras and microphonec connected to the computer or smarphone
export const getLocalStream = () => {
    navigator.mediaDevices.getUserMedia(configuration)
        .then((stream) => {
            store.dispatch(setLocalStream(stream));
            console.log("xx stream", stream)
        })
        .catch((err) =>{
            console.log("error occured when trying to get access to local stream", err)
        })
}
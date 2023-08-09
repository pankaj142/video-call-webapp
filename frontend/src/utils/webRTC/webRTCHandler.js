
import { store } from "../../store/store";
import { setLocalStream } from "../../store/slices/callSlice";

const configuration = {
    'video' : true,
    'audio' : true
}

// get access to cameras and microphonec connected to the computer or smartphone
export const getLocalStream = () => {
    navigator.mediaDevices.getUserMedia(configuration)
        .then((stream) => {
            store.dispatch(setLocalStream( stream));
        })
        .catch((err) =>{
            console.log("error occured when trying to get access to local stream", err)
        })
}
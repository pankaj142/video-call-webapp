import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCallRejected } from "../../store/slices/callSlice";

import './CallRejectedDialog.css';

const CallRejectedDialog = ({reason}) =>{
    const dispatch = useDispatch();

    useEffect(()=>{
        setTimeout(()=>{
            dispatch(setCallRejected({
                rejected: false,
                reason: ''
            }))
        }, 4000)
    }, [dispatch])
    return (
        <div className="call_rejected_dialog background_secondary_color">
            {reason}
        </div>
    )
};

export default CallRejectedDialog;

import './IncomingCallDialog.css';


const IncomingCallDialog = () =>{

    const handleAcceptCall = () =>{

    }

    const handleRejectCall = () => {

    }



    return (
        <div className="direct_call_dialog background_secondary_color" >
            <span className="direct_call_dialog_caller_name" >Caller</span>
            <div className="direct_call_dialog_button_container">
                <button className="direct_call_dialog_accept_button" onClick={handleAcceptCall}>
                    Accept
                </button>
                <button className="direct_call_dialog_reject_button" onClick={handleRejectCall}>
                    Reject
                </button>
            </div>
        </div>
    )
};

export default IncomingCallDialog;


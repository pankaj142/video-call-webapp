
import { useEffect } from "react";
import ActiveUsersList from "../../Components/ActiveUsersList/ActiveUsersList";
import DashboardInformation from "../../Components/DashboardInformation/DashboardInformation";
import DirectCall from "../../Components/DirectCall/DirectCall";
import * as webRTChandler from "../../utils/webRTC/webRTCHandler";

import logo from "../../assets/logo.png";
import './Dashboard.css';
import { useSelector } from "react-redux";
import { callStates } from "../../store/slices/callSlice";
import * as webRTCGroupCallHandler from "../../utils/webRTC/webRTCGroupCallHandler";

const Dashboard = () => {
    const username = useSelector((state)=> state.dashboard.username)
    const callState = useSelector((state)=> state.call.callState);

    useEffect(() => {
        webRTChandler.getLocalStream();
        webRTCGroupCallHandler.connectWithMyPeer(); // connect with peer server for group calls
    }, []);

    return (
        <div className="dashboard_container background_main_color">
            <div className="dashboard_left_section">
                <div className="dashboard_content_container">
                    <DirectCall />
                    { callState !== callStates.CALL_IN_PROGRESS && 
                    <DashboardInformation username={username} /> }  
                </div>
                <div className="dashboard_rooms_container background_secondary_color">
                    room
                </div>
            </div>
            <div className="dashboard_right_section background_secondary_color">
                <div className="dashboard_active_users_list">
                    <ActiveUsersList/>
                </div>
                <div className="dashboard_logo_container">
                    <img
                        className="dashboard_logo_image"
                        src={logo} 
                        alt="App logo" 
                    />
                </div>
            </div>
        </div>
    )
};

export default Dashboard;
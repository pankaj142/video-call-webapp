
import { useEffect } from "react";
import axios from "axios";
import ActiveUsersList from "../../Components/ActiveUsersList/ActiveUsersList";
import DashboardInformation from "../../Components/DashboardInformation/DashboardInformation";
import DirectCall from "../../Components/DirectCall/DirectCall";
import GroupCall from "../../Components/GroupCall/GroupCall";
import GroupCallRooomsList from "../../Components/GroupCallRoomsList/GroupCallRoomsList";
import * as webRTChandler from "../../utils/webRTC/webRTCHandler";

import logo from "../../assets/logo.png";
import './Dashboard.css';
import { useSelector } from "react-redux";
import { callStates } from "../../store/slices/callSlice";
import * as webRTCGroupCallHandler from "../../utils/webRTC/webRTCGroupCallHandler";
import { setTurnServers } from "../../utils/webRTC/TURN";

const Dashboard = () => {
    const username = useSelector((state)=> state.dashboard.username)
    const callState = useSelector((state)=> state.call.callState);

    useEffect(() => {
        // fetch TURN credentials from our backend  
        axios.get(`${process.env.REACT_APP_SERVER_URL}/api/get-turn-data}`)
            .then((response) => {
                console.log("res ddata", response);
                setTurnServers(response.data.token.iceServers);

                webRTChandler.getLocalStream();
                webRTCGroupCallHandler.connectWithMyPeer(); // connect with peer server for group calls
            }).catch((err)=>{
                console.log("Error occured during fetching TURN credentials from backend");
                console.log(err);
            })
    }, []);

    return (
        <div className="dashboard_container background_main_color">
            <div className="dashboard_left_section">
                <div className="dashboard_content_container">
                    <DirectCall />
                    <GroupCall />
                    { callState !== callStates.CALL_IN_PROGRESS && 
                    <DashboardInformation username={username} /> }  
                </div>
                <div className="dashboard_rooms_container background_secondary_color">
                    <GroupCallRooomsList/>
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
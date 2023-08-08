
import ActiveUsersList from "../../Components/ActiveUsersList/ActiveUsersList"
import './Dashboard.css'
import logo from "../../assets/logo.png"
import { useEffect } from "react";
import * as webRTChandler from "../../utils/webRTC/webRTCHandler";

const Dashboard = () => {

    useEffect(() => {
        webRTChandler.getLocalStream()
    }, []);

    return (
        <div className="dashboard_container background_main_color">
            <div className="dashboard_left_section">
                <div className="dashboard_content_container">
                    content 
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
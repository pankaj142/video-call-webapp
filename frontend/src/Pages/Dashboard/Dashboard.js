import { useSelector, useDispatch } from "react-redux";
import { saveUserName,increaseCounter } from '../../store/slices/dashboardSlice';
import './Dashboard.css'
import logo from "../../assets/logo.png"

const Dashboard = () => {
    const username = useSelector((state) => state.dashboard.userName)
    const dispatch = useDispatch();

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
                    users
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
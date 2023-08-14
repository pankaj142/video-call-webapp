import './DashboardInformation.css';

const DashboardInformation = ({ username}) => {
    return (
        <div className="dashboard_info_text_container">
            <span className="dashboard_info_text_title">
                Hello {username} welcome in Video Call App.
            </span>
            <span className="dashboard_info_text_description">
                You can start a call calling directly to a person from the list or you can create or join a group call.
            </span>            
        </div>
    )
}

export default DashboardInformation;
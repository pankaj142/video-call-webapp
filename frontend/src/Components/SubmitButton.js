
const SubmitButton = ({handleSubmit}) =>{
    return (
        <div className="login-page_button_container">
            <button
                className="login-page_button background_main_color text_main_color"
                onClick={handleSubmit}
            >
                Start using VideoChat</button>
        </div>
    );
}

export default SubmitButton;
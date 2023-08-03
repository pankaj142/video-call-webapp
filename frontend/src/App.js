import { useEffect } from 'react';
import {connectWithWebSocket} from "./utils/wssConnection/wssConnection"

import './App.css';

function App() {

  useEffect(()=>{
    connectWithWebSocket();
  }, [])
  return (
    <div className="App">
      hello
    </div>
  );
}

export default App;

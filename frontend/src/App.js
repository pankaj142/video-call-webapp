import { useEffect } from 'react';
import {connectWithWebSocket} from "./utils/wssConnection/wssConnection"
import {
  createBrowserRouter,
  RouterProvider,
  Route
} from 'react-router-dom';

import './App.css';
import Dashboard from './Components/Dashboard';
import LoginPage from './Components/LoginPage';

const router = createBrowserRouter([
  {
    path : "/dashboard",
    element : <Dashboard/>
  },
  {
    path : '/',
    element : <LoginPage/>
  }
])


function App() {

  useEffect(()=>{
    connectWithWebSocket();
  }, [])
  return (
    <RouterProvider router={router}/>
  );
}

export default App;

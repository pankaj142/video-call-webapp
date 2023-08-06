import { useEffect } from 'react';
import {connectWithWebSocket} from "./utils/wssConnection/wssConnection"
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import './App.css';
import Dashboard from './Pages/Dashboard/Dashboard';
import LoginPage from './Pages/LoginPage/LoginPage';

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


const App = () => {
  useEffect(()=>{
    connectWithWebSocket();
  }, [])

  return (
    <RouterProvider router={router}/>
  );
}

export default App;

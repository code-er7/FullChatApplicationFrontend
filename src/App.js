import React from 'react'
import {BrowserRouter as Router , Routes , Route } from "react-router-dom";
import ChatPage from './pages/ChatPage';
import Home from './pages/Home';
import "./App.css"

const App = () => {
  return (
  

   
     <Router>  
          <div className='App'>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chats" element={<ChatPage/>}/>
        </Routes>
          </div>
     </Router>
     
  )
}

export default App
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import Home from "./pages/Home";
import "./App.css";
import ChatProvider from "./context/ChatProvider";

const App = () => {
  return (
    <Router>
      <div className="App">
        <ChatProvider>
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chats" element={<ChatPage />} />
          </Routes>
        </ChatProvider>
      </div>
    </Router>
  );
};

export default App;

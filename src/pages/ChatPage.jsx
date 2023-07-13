import React, { useEffect, useState } from 'react'
import axios from "axios";


const ChatPage = () => {
    const [chats, setChats] = useState([]);

    useEffect(() => {
    fetchChats(); 
    }, [])


    const fetchChats = async ()=>{
        try {
            const {data} = await axios.get("/api/chat");
            setChats(data);
            // console.log(data);
        } catch (error) {
            console.log("a error occured " , error);
        }
    }
  
  return (
    <div>
        {
            chats.map((chat)=>(
               <div key={chat._id}> {chat.chatName}</div>
            ))
        }
    </div>
  )
}

export default ChatPage
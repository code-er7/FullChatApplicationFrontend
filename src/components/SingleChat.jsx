import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogic";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import "./styles.css"
import ScrollableChat from "./ScrollableChat";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const { user, selectedChat, setselectedChat } = ChatState();
  const toast = useToast();
  //functions

  useEffect(() => {
    fetchMessages();
  }, [selectedChat])
  
  const fetchMessages = async()=>{
    if(!selectedChat)return ;
    try{
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const {data} = await axios.get(`/api/message/${selectedChat._id}` , config);
      console.log(data);
      setMessages(data);
      setLoading(false);
    }
    catch(error){
        setLoading(false);
        toast({
          title: "Error Occured!",
          description: "Failed to send Message ",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "bottom",
        });
    }
  }
  const sendMessage = async(e) => {
     if(e.key==='Enter' && newMessage){
        try { 
          const config ={
            headers:{
               "Content-type":"application/json",
               Authorization: `Bearer ${user.token}`,
            },
          };
           const temp = newMessage;
           setNewMessage("");
          const {data} = await axios.post('/api/message' , {
            content:temp,
            chatId:selectedChat._id
          } , config)
          console.log(data);
         
          setMessages([...messages , data]);
        } catch (error) {
          setLoading(false);
          toast({
            title:"Error Occured!",
            description:"Failed to send Message ",
            status:"error",
            duration:2000,
            isClosable:true,
            position:"bottom"
          })
        }
     }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    //typing indicator Logic 
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w={"100%"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setselectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                {
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  ></UpdateGroupChatModal>
                }
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#E8E8E8"}
            w={"100%"}
            h={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages}/></div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                varient="filled"
                bg={"#E0E0E0"}
                placeholder="Enter a message.."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          h={"100%"}
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
            Click On a User To Start Chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;

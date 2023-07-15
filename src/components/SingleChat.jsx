import React from "react";
import { ChatState } from "../context/ChatProvider";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogic";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setselectedChat } = ChatState();
  return <>{
    selectedChat?(<>
     <Text
       fontSize={{ base : "28px"  , md:"30px"}}
       pb={3}
       px={2}
       w={"100%"}
       fontFamily={"Work sans"}
       display={"flex"}
       justifyContent={{base : "space-between"}}
       alignItems={"center"}
     >
         <IconButton
           display={{ base : "flex" , md: "none"}}
           icon={<ArrowBackIcon/>}
           onClick={()=>setselectedChat("")}
         />
         {
            !selectedChat.isGroupChat?(<>{getSender(user , selectedChat.users)}
             <ProfileModal user = {getSenderFull(user , selectedChat.users)} />
            </>):(<>
               {selectedChat.chatName.toUpperCase()}
               {
                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}></UpdateGroupChatModal>
               }
            </>)
         }

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
         {/* Messages Here */}
     </Box>
    </>):(<Box display={"flex"} justifyContent={"center"} alignItems={"center"} h={"100%"}>
         <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
             Click On a User To Start Chatting
         </Text>
    </Box>)
  }</>;
};

export default SingleChat;

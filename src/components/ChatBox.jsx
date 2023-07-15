import React from "react";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
import SingleChat from "./SingleChat";
const ChatBox = ({fetchAgain , setFetchAgain}) => {
  const { selectedChat } = ChatState();
 const display = useBreakpointValue({
   base: selectedChat ? "flex" : "none",
   md: "flex",
 });
 const width = useBreakpointValue({ base: "100%", md: "68%" });

 return (
   <Box
     display={display}
     alignItems="center"
     flexDirection="column"
     p={3}
     bg="white"
     width={width}
     borderRadius="lg"
     borderWidth="1px"
   >
     <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
   </Box>
 );
};

export default ChatBox;

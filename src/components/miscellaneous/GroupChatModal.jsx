import {
  Box,
  Button,
  FormControl,
  Input,
  useControllableState,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { Children, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import { Form } from "react-router-dom";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState();

  const toast = useToast();
  const { user, chats, setChats } = ChatState();

  //functions
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occured !",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleSubmit = async () => {
    if(!groupChatName || !selectedUsers){
        toast({
          title: "Error Occured !",
          description: "Please fill all the feilds",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        });
        return ;
    }
    try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };   
        const {data}= await axios.post('api/chat/group' , {
            name : groupChatName , 
            users:JSON.stringify(selectedUsers.map((u)=>u._id)),
        } , config);
        setChats([data , ...chats]);
        onClose();
        toast({
          title: "Created succesfully !",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        });
        setSelectedUsers([]);
    } catch (error) {
         toast({
           title: "Error Occured !",
           description: "Unable to Create a Group",
           status: "error",
           duration: 2000,
           isClosable: true,
           position: "bottom-left",
         });
         return;
    }
  };
  const AddUserToGroup = async (ClickedUser) => {
    if (selectedUsers.includes(ClickedUser)) {
      toast({
        title: "User already added !",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, ClickedUser]);
  };
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter(sel => sel._id !== delUser._id));
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Piyush , Jane"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w={"100%"} display={"flex"} flexWrap={"wrap"}>
              {selectedUsers.map((User) => {
                return (
                  <UserBadgeItem
                    key={User._id}
                    user={User}
                    handleFunction={() => handleDelete(User)}
                  />
                );
              })}
            </Box>
            {loading ? (
              <div>loading</div>
            ) : (
              searchResult?.slice(0, 4).map((ResUser) => {
                return (
                  <UserListItem
                    key={ResUser._id}
                    user={ResUser}
                    handleFunction={() => AddUserToGroup(ResUser)}
                  />
                );
              })
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create
            </Button>
            <Button onClick={onClose} variant="ghost">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;

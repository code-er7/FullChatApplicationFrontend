import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Button,
  useToast,
  Box,
  FormControl,
  Input,
  Spinner,
} from "@chakra-ui/react";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import { useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
// import { useNavigate } from "react-router-dom";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  //   const navigate = useNavigate();
  const { user, selectedChat, setselectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState();
  //    const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState();
  const [renameLoading, setRenameLoading] = useState();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  //functions

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only Admins Can remove",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      console.log(data);
      if (user1._id === user._id) {
        setselectedChat();
      } else {
        setselectedChat(data);
      }
      setLoading(false);
      fetchMessages();
      setFetchAgain(!fetchAgain);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Can't remove the User",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };
  const AddUserToGroup = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User already exists in Group !",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only Admins Can Add",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      setselectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Can't add the User",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };
  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setGroupChatName("");
      setselectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      setGroupChatName("");
      setRenameLoading(false);
      toast({
        title: "Error Occured !",
        description: "Unable to Handle request",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
  };
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

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <Box w={"100%"} display={"flex"} flexWrap={"wrap"}>
              {selectedChat.users.map((User) => {
                return (
                  <UserBadgeItem
                    key={User._id}
                    user={User}
                    handleFunction={() => handleRemove(User)}
                  />
                );
              })}
            </Box>
            <FormControl display={"flex"}>
              <Input
                placeholder="Group Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant={"solid"}
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to Group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              ></Input>
            </FormControl>
            {loading ? (
              <Spinner size={"lg"} />
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
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
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

export default UpdateGroupChatModal;

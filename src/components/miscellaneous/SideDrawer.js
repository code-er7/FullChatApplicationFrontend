import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Input,
  DrawerFooter,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";

const SideDrawer = () => {
  const navigate = useNavigate();
  const { user } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const logOutHanldler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const handleSearch = async()=>{
    if(!search){
       toast({
        title: "Please Enter something in search",
        status:"warning",
        duration:2000,
        isClosable:true,
        position:"top-left"
       })
       return ;
    }
    try {
      setLoading(true);
      const config = {
        headers:{
          Authorization:`Bearer ${user.token}`,
        }
      }
      const {data} = await axios.get(`/api/user?search=${search}` , config);
      setLoading(false);
      setSearchResults(data);
      // console.log(data);
      
    } catch (error) {
        toast({
          title: "Failed to load",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "bottom-left",
        });
        return;
    }

  }
  const accessChat = async(userId)=>{

  }
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        p={"5px 10px 5px 10px"}
        borderWidth={"5px"}
      >
        <Tooltip label="Search User to Chat" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <i class="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px={"4"}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"Work sans"}>
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize={"2xl"} margin={1} />
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>

              <MenuDivider />
              <MenuItem onClick={logOutHanldler}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        // finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>

          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search by name/email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {
              loading?(<ChatLoading/>):
              (
                searchResults?.map((users)=>{
                  return (
                    <UserListItem
                      key={users._id}
                      user={users}
                      handleFunction={() => accessChat(users._id)}
                    />
                  );
                })
              ) 
            }
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;

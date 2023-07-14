import { ViewIcon } from '@chakra-ui/icons';
import { Button, IconButton, Image, Text, useDisclosure } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
 
} from "@chakra-ui/react";
import React from 'react'

const ProfileModal = ({user , children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size={'lg'} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h={"400px"}>
          <ModalHeader
           display={'flex'}
           fontSize={"40px"}
           fontFamily={"Work sans"}
           justifyContent={"center"}
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody 
              display={'flex'}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={'space-between'}
          >
             <Image
               borderRadius={'full'}
               boxSize="150px"
               src={user.pic}
               alt={user.name}
             />
             <Text>{user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfileModal
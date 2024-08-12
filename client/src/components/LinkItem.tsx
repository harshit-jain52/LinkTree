import { useState } from "react";
import { ExternalLinkIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  HStack,
  Button,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
} from "@chakra-ui/react";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export type LinkT = {
  _id: string;
  title: string;
  url: string;
};

function LinkItem({ link, isEditing }: { link: LinkT; isEditing: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const handleSave = () => {
    updateLink();
    handleClose();
  };

  const queryClient = useQueryClient();
  const { mutate: deleteLink, isPending: isDeleting } = useMutation({
    mutationKey: ["deleteLink"],
    mutationFn: async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/links/${link._id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("treeToken")}`,
            },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error) || "Something went wrong";
        }
        return data;
      } catch (error) {
        console.error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
    onError: (error) => {
      alert(error.message || "Something went wrong");
    },
  });
  const { mutate: updateLink, isPending: isUpdating } = useMutation({
    mutationKey: ["updateLink"],
    mutationFn: async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/links/${link._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("treeToken")}`,
            },
            body: JSON.stringify({ title, url }),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error) || "Something went wrong";
        }
        return data;
      } catch (error) {
        console.error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
    onError: (error) => {
      alert(error.message || "Something went wrong");
    },
  });

  return (
    <HStack spacing={4}>
      <Button
        as="a"
        href={link.url}
        target="_blank"
        rightIcon={<ExternalLinkIcon />}
        variant="solid"
        width={"100%"}
      >
        {link.title}
      </Button>
      {isEditing && (
        <>
          <Box color={"green.500"} cursor={"pointer"} onClick={handleOpen}>
            {!isUpdating && <EditIcon />}
          </Box>
          <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit Link</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <FormLabel>Dsiplay Text</FormLabel>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>URL</FormLabel>
                  <Input value={url} onChange={(e) => setUrl(e.target.value)} />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleSave}>
                  Save
                </Button>
                <Button variant="ghost" onClick={handleClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Box
            color={"red.500"}
            cursor={"pointer"}
            onClick={() => deleteLink()}
          >
            {!isDeleting && <DeleteIcon />}
          </Box>
        </>
      )}
    </HStack>
  );
}

export default LinkItem;

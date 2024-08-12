import {
  Box,
  Flex,
  Grid,
  GridItem,
  InputGroup,
  Input,
  InputLeftElement,
  FormControl,
  FormLabel,
  useColorModeValue,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { LinkIcon, AddIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../App";

function LinkForm() {
  const bg = useColorModeValue("gray.300", "gray.700");
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const queryClient = useQueryClient();

  const { mutate: createLink, isPending: isCreating } = useMutation({
    mutationKey: ["createLink"],
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const response = await fetch(
          `${BASE_URL}/links/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("treeToken")}`,
            },
            body: JSON.stringify({ title: newTitle, url: newUrl }),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error) || "Something went wrong";
        }
        setNewTitle("");
        setNewUrl("");
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
    <Box bg={bg} borderRadius={"7"} px={4} py={4}>
      <form onSubmit={createLink}>
        <Grid templateColumns={"repeat(5, 1fr)"}>
          <GridItem colSpan={4}>
            <Flex
              justifyContent={"space-evenly"}
              flexDirection={"column"}
              gap={5}
            >
              <FormControl isRequired>
                <FormLabel fontSize={"lg"}>Text to display</FormLabel>
                <Input
                  type="text"
                  variant="flushed"
                  placeholder="Enter the display text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize={"lg"}>Link to redirect to</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <LinkIcon />
                  </InputLeftElement>
                  <Input
                    type="text"
                    variant="outlined"
                    placeholder="Enter the URL"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                  />
                </InputGroup>
              </FormControl>
            </Flex>
          </GridItem>
          <GridItem rowSpan={2}>
            <Flex justifyContent="center" alignItems="center" height="100%">
              <Button variant={"solid"} type="submit">
                {isCreating ? <Spinner size="xs" /> : <AddIcon />}
              </Button>
            </Flex>
          </GridItem>
        </Grid>
      </form>
    </Box>
  );
}

export default LinkForm;

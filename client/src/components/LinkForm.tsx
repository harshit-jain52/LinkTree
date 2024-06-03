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
} from "@chakra-ui/react";
import { LinkIcon, AddIcon } from "@chakra-ui/icons";

function LinkForm() {
  const bg = useColorModeValue("gray.300", "gray.700");

  return (
    <Box bg={bg} borderRadius={"7"} px={4} py={4}>
      <Grid templateColumns={"repeat(5, 1fr)"}>
        <GridItem colSpan={4}>
          <Flex
            justifyContent={"space-evenly"}
            flexDirection={"column"}
            gap={5}
          >
            <FormControl isRequired>
              <FormLabel fontSize={"lg"}>Text to display</FormLabel>
              <Input variant="flushed" placeholder="Enter the display text" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize={"lg"}>Link to redirect to</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <LinkIcon />
                </InputLeftElement>
                <Input variant="outlined" placeholder="Enter the URL" />
              </InputGroup>
            </FormControl>
          </Flex>
        </GridItem>
        <GridItem rowSpan={2}>
          <Flex justifyContent="center" alignItems="center" height="100%">
            <Button variant={"solid"}>
              <AddIcon />
            </Button>
          </Flex>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default LinkForm;

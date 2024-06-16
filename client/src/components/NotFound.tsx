import { WarningTwoIcon } from "@chakra-ui/icons";
import { Container, Flex, Text } from "@chakra-ui/react";

function NotFound() {
  return (
    <Container maxW={"1000px"}>
      <Flex direction={"column"} justifyContent={"center"} textAlign={"center"}>
        <Text fontSize="6xl">
          404
          <WarningTwoIcon />
        </Text>
        <Text fontSize="4xl"> Page Not Found </Text>
      </Flex>
    </Container>
  );
}

export default NotFound;

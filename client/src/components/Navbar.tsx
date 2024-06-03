import {
  Container,
  Box,
  useColorMode,
  useColorModeValue,
  Grid,
  Text,
  Button,
} from "@chakra-ui/react";

import { LuSun, LuMoon, LuGithub } from "react-icons/lu";

function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.300", "gray.700");

  return (
    <Container maxW={"1000px"}>
      <Box bg={bg} borderRadius={"7"} px={4} my={4}>
        <Grid
          templateColumns="repeat(3, 1fr)"
          alignItems="center"
          gap={3}
          h={20}
        >
          <Button
            variant={"ghost"}
            leftIcon={<LuGithub />}
            onClick={() =>
              window.open(
                "https://github.com/harshit-jain52/LinkTree",
                "_blank"
              )
            }
            fontSize={"xl"}
            justifySelf={"start"}
          >
            Repo
          </Button>
          <Text fontSize={"4xl"} fontWeight={500} textAlign="center">
            LinkTree
          </Text>
          <Button onClick={toggleColorMode} fontSize={"xl"} justifySelf={"end"}>
            {colorMode === "dark" ? <LuSun /> : <LuMoon />}
          </Button>
        </Grid>
      </Box>
    </Container>
  );
}

export default Navbar;

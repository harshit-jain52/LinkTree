import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Heading, Flex, Input, Link } from "@chakra-ui/react";

function Home() {
  const [treeName, setTreeName] = useState("");
  const navigate = useNavigate();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
      <Heading mb="6">Enter Tree Name</Heading>
      <Flex justifyContent="center" alignItems="center" maxWidth="600px">
        <Input value={treeName} onChange={(e) => setTreeName(e.target.value)} />
        <Button
          colorScheme="teal"
          fontSize="md"
          onClick={() => {
            navigate(`/tree/${treeName}`);
          }}
          ml={4}
        >
          Go
        </Button>
      </Flex>
      <Box mt={4}>
        <Link color="teal.400" onClick={() => navigate("/login")}>
          Login
        </Link>
      </Box>
    </Box>
  );
}

export default Home;

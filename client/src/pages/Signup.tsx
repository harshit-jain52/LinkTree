import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Link,
  Heading,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useSignup();
  const [tree, setTree] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    const success = await signup({ username: tree, password });
    if (success) {
      navigate(`/edit/${tree}`);
    }
  };

  return (
    <Box
      width="full"
      maxW="md"
      mx="auto"
      mt="8"
      p="6"
      rounded="lg"
      boxShadow="lg"
    >
      <Heading mb="6">Create a new tree</Heading>
      <form onSubmit={handleSignup}>
        <VStack spacing="6">
          <FormControl>
            <FormLabel id="tree">Tree ID</FormLabel>
            <Input
              name="tree"
              type="text"
              value={tree}
              onChange={(e) => setTree(e.target.value)}
              required
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>
          <Button type="submit" colorScheme="teal" size="lg" fontSize="md">
            Sign up
          </Button>
          <Text mt="4">
            Already have an account?{" "}
            <Link color="teal.500" onClick={() => navigate("/login")}>
              Login
            </Link>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default SignupPage;

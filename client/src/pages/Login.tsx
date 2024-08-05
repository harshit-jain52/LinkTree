import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useLogin();
  const [tree, setTree] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const success = await login({ username: tree, password });
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
      <form onSubmit={handleLogin}>
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
            Sign in
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default LoginPage;

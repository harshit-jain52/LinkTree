import { Container, Stack } from "@chakra-ui/react";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Stack h="100vh">
      <Navbar />
      <Container>
        {/* <LinkForm />
        <LinkList /> */}
      </Container>
    </Stack>
  );
}

export default App;

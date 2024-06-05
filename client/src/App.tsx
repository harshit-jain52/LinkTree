import { Container, Stack } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import LinkForm from "./components/LinkForm";
import LinkList from "./components/LinkList";

function App() {
  return (
    <Stack h="100vh">
      <Navbar />
      <Container>
        <LinkList />
        <LinkForm />
      </Container>
    </Stack>
  );
}

export default App;

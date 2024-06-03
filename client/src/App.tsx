import { Container, Stack } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import LinkForm from "./components/LinkForm";

function App() {
  return (
    <Stack h="100vh">
      <Navbar />
      <Container>
        <LinkForm />
        {/* <LinkList />  */}
      </Container>
    </Stack>
  );
}

export default App;

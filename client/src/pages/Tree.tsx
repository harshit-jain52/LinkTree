import { Container, Button, Flex } from "@chakra-ui/react";
import LinkList from "../components/LinkList";
import { useParams, useNavigate } from "react-router-dom";
import NotFound from "../components/NotFound";

function Tree() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  const handleEditTree = () => {
    navigate("/login");
  };

  if (!name) {
    return <NotFound />;
  }

  return (
    <Container>
      <LinkList treeName={name} isEditing={false} />
      <Flex justifyContent="center">
        <Button colorScheme="teal" onClick={handleEditTree}>
          Edit Tree
        </Button>
      </Flex>
    </Container>
  );
}

export default Tree;

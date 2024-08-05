import { Container, Button } from "@chakra-ui/react";
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
      <Button onClick={handleEditTree}>Edit Tree</Button>
      <LinkList treeName={name} />
    </Container>
  );
}

export default Tree;
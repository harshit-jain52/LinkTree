import { Container } from "@chakra-ui/react";
import LinkList from "../components/LinkList";
import { useParams } from "react-router";
import NotFound from "../components/NotFound";

function Tree() {
    const { name } = useParams<{ name: string }>();
  
    if (!name) {
      return <NotFound />;
    }
  
    return (
      <Container>
        <LinkList treeName={name} />
      </Container>
    );
  }

export default Tree;

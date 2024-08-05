import { Container } from "@chakra-ui/react";
import LinkList from "../components/LinkList";
import { useParams } from "react-router-dom";
import NotFound from "../components/NotFound";
import LinkForm from "../components/LinkForm";

function EditTree() {
  const { name } = useParams<{ name: string }>();

  if (!name) {
    return <NotFound />;
  }

  return (
    <Container>
      <LinkForm />
      <LinkList treeName={name} />
    </Container>
  );
}

export default EditTree;

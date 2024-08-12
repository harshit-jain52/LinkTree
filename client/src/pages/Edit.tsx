import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Container } from "@chakra-ui/react";
import LinkList from "../components/LinkList";
import NotFound from "../components/NotFound";
import LinkForm from "../components/LinkForm";

function EditTree() {
  const { name } = useParams<{ name: string }>();

  const checkAuth = async () => {
    if (!localStorage.getItem("treeToken")) {
      window.location.href = "/login";
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/${name}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("treeToken")}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error) || "Something went wrong";
      }
      return data;
    } catch (error) {
      console.error(error);
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (!name) {
    return <NotFound />;
  }

  return (
    <Container>
      <LinkForm />
      <LinkList treeName={name} isEditing={true} />
    </Container>
  );
}

export default EditTree;

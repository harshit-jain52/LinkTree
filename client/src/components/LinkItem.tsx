import { ExternalLinkIcon, DeleteIcon } from "@chakra-ui/icons";
import { HStack, Button, Box } from "@chakra-ui/react";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export type LinkT = {
  _id: string;
  title: string;
  url: string;
};

function LinkItem({ link, isEditing }: { link: LinkT; isEditing: boolean }) {
  const queryClient = useQueryClient();
  const { mutate: deleteLink, isPending: isDeleting } = useMutation({
    mutationKey: ["deleteLink"],
    mutationFn: async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/links/${link._id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("treeToken")}`,
            },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error) || "Something went wrong";
        }
        return data;
      } catch (error) {
        console.error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
    onError: (error) => {
      alert(error.message || "Something went wrong");
    },
  });
  return (
    <HStack spacing={4}>
      <Button
        as="a"
        href={link.url}
        target="_blank"
        rightIcon={<ExternalLinkIcon />}
        variant="solid"
      >
        {link.title}
      </Button>
      {isEditing && (
        <Box color={"red.500"} cursor={"pointer"} onClick={() => deleteLink()}>
          {!isDeleting && <DeleteIcon />}
        </Box>
      )}
    </HStack>
  );
}

export default LinkItem;

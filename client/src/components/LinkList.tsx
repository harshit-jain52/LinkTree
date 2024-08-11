import { Flex, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import LinkItem, { LinkT } from "./LinkItem";
import NotFound from "./NotFound";

function LinkList({
  treeName,
  isEditing,
}: {
  treeName: string;
  isEditing: boolean;
}) {
  const {
    data: links,
    isLoading,
    isError,
  } = useQuery<LinkT[]>({
    queryKey: ["links"],
    queryFn: async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/links/${treeName}`
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error) || "Something went wrong";
        }
        return data || [];
      } catch (error) {
        console.error(error);
      }
    },
  });

  if (isError) {
    return <NotFound />;
  }

  return (
    <>
      {isLoading ? (
        <Flex justifyContent={"center"} textAlign={"center"}>
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Flex flexDirection={"column"} my={5} gap={4}>
          {links?.map((link) => (
            <LinkItem key={link._id} link={link} isEditing={isEditing} />
          ))}
        </Flex>
      )}
    </>
  );
}

export default LinkList;

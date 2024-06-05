import { Flex, Spinner } from "@chakra-ui/react";
import LinkItem from "./LinkItem";
import { useQuery } from "@tanstack/react-query";

export type LinkT = {
  _id: string;
  title: string;
  url: string;
};

function LinkList() {
  const { data: links, isLoading } = useQuery<LinkT[]>({
    queryKey: ["links"],
    queryFn: async () => {
      try {
        const response = await fetch("http://localhost:5000/api/links");
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
  return (
    <>
      {isLoading ? (
        <Flex justifyContent={"center"} textAlign={"center"}>
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Flex flexDirection={"column"} my={5} gap={4}>
          {links?.map((link) => (
            <LinkItem key={link._id} link={link} />
          ))}
        </Flex>
      )}
    </>
  );
}

export default LinkList;

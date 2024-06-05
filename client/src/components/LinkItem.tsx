import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { LinkT } from "./LinkList";

function LinkItem({ link }: { link: LinkT }) {
  return (
    <Button
      as="a"
      href={link.url}
      target="_blank"
      rightIcon={<ExternalLinkIcon />}
      variant="solid"
    >
      {link.title}
    </Button>
  );
}

export default LinkItem;

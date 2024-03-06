import { Box, Button, HStack, Heading } from "@chakra-ui/react";
import { memo } from "react";
import locations from "locations";
import { Link } from "react-router-dom";

type MenuData = {
  label: string;
  href: string;
};

const menus: MenuData[] = [
  {
    label: "Play",
    href: locations.createUser,
  },
  {
    label: "Questions",
    href: locations.listQuestions,
  },
];

export default memo(function Header() {
  return (
    <HStack as="header" py={{ base: 2, md: 4 }} gap={4} alignItems={"baseline"}>
      <Heading as="h1" flex={1}>
        Quiz
      </Heading>
      <HStack divider={<Box w={"1px"} />} alignItems={"stretch"}>
        {menus.map((menu) => (
          <Button variant={"link"} key={menu.label} as={Link} to={menu.href}>
            {menu.label}
          </Button>
        ))}
      </HStack>
    </HStack>
  );
});

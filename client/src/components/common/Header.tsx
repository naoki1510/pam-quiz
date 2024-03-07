import { Box, Button, HStack, Heading } from "@chakra-ui/react";
import locations from "locations";
import { memo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import passwordState from "recoil/passwordState";
import { useAuthorize } from "./Authorize";

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
  {
    label: "Users",
    href: locations.listQuestions,
  },
];

export default memo(function Header() {
  const navigate = useNavigate();
  const authorized = useAuthorize();
  const submitPassword = useSetRecoilState(passwordState);

  const handleLogout = useCallback(() => {
    submitPassword("");
    navigate(locations.createUser);
  }, []);

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
        {authorized && (
          <Button variant={"link"} onClick={handleLogout}>
            Exit
          </Button>
        )}
      </HStack>
    </HStack>
  );
});

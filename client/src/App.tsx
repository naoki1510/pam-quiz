import { Container, Flex } from "@chakra-ui/react";
import Header from "components/common/Header";
import { Outlet } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Container minH={"100dvh"} display={"flex"} flexDir={"column"}>
      <Header />
      <Flex py={{ base: 2, md: 4 }} direction={"column"} flex={1}>
        <Outlet />
      </Flex>
    </Container>
  );
}

export default App;

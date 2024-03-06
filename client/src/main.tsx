import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import router from "router.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <RecoilRoot>
        <RouterProvider router={router} />
      </RecoilRoot>
    </ChakraProvider>
  </React.StrictMode>
);

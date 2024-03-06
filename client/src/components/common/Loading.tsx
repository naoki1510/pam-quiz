import { Center, CircularProgress } from "@chakra-ui/react";
import { memo } from "react";

export default memo(function Loading() {
  return (
    <Center flex={1}>
      <CircularProgress isIndeterminate color="green.300" />
    </Center>
  );
});

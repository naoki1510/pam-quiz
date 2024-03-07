import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { memo, useCallback, useState } from "react";
import { Outlet } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import passwordState from "recoil/passwordState";

export const useAuthorize = () => {
  const password = useRecoilValue(passwordState);

  return password === import.meta.env.VITE_ADMIN_PASSWORD;
};

export default memo(function Authorize() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const authorized = useAuthorize();
  const submitPassword = useSetRecoilState(passwordState);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLElement>) => {
      e.preventDefault();
      submitPassword(password);
      setMessage("パスワードが間違っています。");
    },
    [password]
  );

  return authorized ? (
    <Outlet />
  ) : (
    <VStack
      flex={1}
      justify="center"
      align="stretch"
      gap={4}
      as={"form"}
      onSubmit={handleSubmit}
    >
      <FormControl>
        <FormLabel>ここから先は秘密のエリアです。</FormLabel>
        <Input
          type="password"
          placeholder="管理用パスワード"
          value={password}
          onChange={handleChange}
        />
      </FormControl>
      {message && <Text>{message}</Text>}
      <Button type="submit" colorScheme="blue">
        送信
      </Button>
    </VStack>
  );
});

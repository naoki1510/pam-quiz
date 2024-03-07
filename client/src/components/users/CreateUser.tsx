import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import { FormEvent, memo, useCallback, useEffect, useState } from "react";
import { createUser, useUsers } from "api/users";
import { useNavigate } from "react-router-dom";
import locations from "locations";
import { useRecoilState } from "recoil";
import userIdState from "recoil/userIdState";

export default memo(function CreateUser() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const { users } = useUsers();
  const [userId, setUserID] = useRecoilState(userIdState);

  const handleCreateUser = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      createUser({ name })
        .then((user) => {
          setUserID(user.id);
          navigate(locations.createAnswer);
        })
        .catch(console.error);
    },
    [name]
  );

  useEffect(() => {
    if (userId !== undefined) {
      navigate(locations.createAnswer);
    }
  }, [navigate]);

  return (
    <Flex
      as="form"
      onSubmit={handleCreateUser}
      flex={1}
      direction={"column"}
      gap={10}
    >
      <Box my={"auto"}>
        <FormControl>
          <FormLabel>名前を入力してね！</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="チカホ 太郎"
          />
          <FormHelperText>
            あとから変更できません。みんなが見てあなただとわかる名前にしてね！
          </FormHelperText>
        </FormControl>
        <Button type="submit" colorScheme="teal" mt={4} w={"full"}>
          決定
        </Button>
      </Box>
      <VStack>
        <Heading size={"sm"}>すでに作成されたユーザーにログイン</Heading>
        {users.map((user) => (
          <Button
            key={user.id}
            onClick={() => {
              setUserID(user.id);
              navigate(locations.createAnswer);
            }}
            colorScheme="teal"
            w={"full"}
            variant={"outline"}
          >
            {user.name}
          </Button>
        ))}
      </VStack>
    </Flex>
  );
});

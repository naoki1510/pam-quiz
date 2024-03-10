import {
  Button,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useUsers } from "api/users";
import { memo, useCallback } from "react";

export default memo(function ListUsers() {
  const { users } = useUsers();

  const handleExport = useCallback(() => {
    //CSVデータ
    const filename = "quiz_results.csv";
    const data =
      "名前, ポイント\n" +
      users.map((user) => `${user.name}, ${user.point}`).join("\n");
    //BOMを付与
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    //BlobからオブジェクトURLを作成
    const blob = new Blob([bom, data], { type: "text/csv" });
    //リンク先にダウンロード用リンクを指定する
    const link = document.createElement("a");
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.click();

    //createObjectURLで作成したオブジェクトURLを開放する
    URL.revokeObjectURL(link.href);
  }, [users]);

  return (
    <VStack align={"stretch"} flex={1} gap={4}>
      <Heading>ユーザー一覧</Heading>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>名前</Th>
              <Th>ポイント</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users
              ?.sort((userA, userB) => userB.point - userA.point)
              .map((user) => (
                <Tr key={user.id}>
                  <Td>{user.name}</Td>
                  <Td>{user.point}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Button onClick={handleExport} colorScheme="teal">
        EXPORT
      </Button>
    </VStack>
  );
});

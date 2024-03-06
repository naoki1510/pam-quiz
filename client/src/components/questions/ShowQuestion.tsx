import { deleteQuestion, useQuestion } from "api/questions";
import Loading from "components/common/Loading";
import locations from "locations";
import { memo, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import QuestionCard from "./QuestionCard";
import { Button, HStack, List, VStack } from "@chakra-ui/react";
import { IoChevronBack, IoPencil, IoTrash } from "react-icons/io5";

export default memo(function ShowQuestion() {
  const navigate = useNavigate();
  const { id } = useParams();
  if (id === undefined) {
    navigate(locations.listQuestions);
    return null;
  }

  const { question, setQuestion } = useQuestion(
    Number(id),
    new URLSearchParams({ show_correct: "true" })
  );

  const handleDelete = useCallback(() => {
    deleteQuestion(id).then(() => {
      navigate(locations.listQuestions);
    });
  }, []);

  return question ? (
    <VStack alignItems={"stretch"} gap={4}>
      <QuestionCard
        question={question}
        setQuestion={setQuestion}
        href={locations.updateQuestion.replace(":id", id)}
        showChoices
        showStartButton
      />
      <HStack>
        <Button
          as={Link}
          to={locations.listQuestions}
          colorScheme="teal"
          leftIcon={<IoChevronBack />}
        >
          戻る
        </Button>
        <Button
          as={Link}
          to={locations.updateQuestion.replace(":id", String(question.id))}
          leftIcon={<IoPencil />}
          colorScheme="blue"
          ml={"auto"}
        >
          編集
        </Button>
        <Button onClick={handleDelete} colorScheme="red" leftIcon={<IoTrash />}>
          削除
        </Button>
      </HStack>
      <List>{}</List>
    </VStack>
  ) : (
    <Loading />
  );
});

import { Button, HStack, VStack } from "@chakra-ui/react";
import { useQuestion } from "api/questions";
import Loading from "components/common/Loading";
import locations from "locations";
import { memo } from "react";
import { IoChevronBack } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";
import QuestionCard from "./QuestionCard";

export default memo(function ShowQuestion() {
  const navigate = useNavigate();
  const { id } = useParams();
  if (id === undefined) {
    navigate(locations.listQuestions);
    return null;
  }

  const { question, setQuestion } = useQuestion(
    id,
    new URLSearchParams({ show_correct: "true" })
  );

  return question ? (
    <VStack alignItems={"stretch"} gap={4}>
      <QuestionCard
        question={question}
        setQuestion={setQuestion}
        href={locations.updateQuestion.replace(":id", id)}
        showChoices
        showActions
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
          to={locations.createQuestion}
          colorScheme="teal"
          ml={"auto"}
          variant={"outline"}
        >
          問題を追加
        </Button>
      </HStack>
    </VStack>
  ) : (
    <Loading />
  );
});

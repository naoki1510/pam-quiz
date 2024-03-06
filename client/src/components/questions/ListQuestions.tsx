import { Button, Text, VStack } from "@chakra-ui/react";
import { useQuestions } from "api/questions";
import Loading from "components/common/Loading";
import QuestionCard from "components/questions/QuestionCard";
import locations from "locations";
import { memo } from "react";
import { Link } from "react-router-dom";

export default memo(function ListQuestions() {
  const { questions, setQuestions } = useQuestions(
    new URLSearchParams({ show_correct: "true" })
  );

  return (
    <VStack alignItems={"stretch"} flex={1} gap={{ base: 2, md: 4 }}>
      {questions ? (
        questions.length ? (
          questions.map((question) => (
            <QuestionCard
              question={question}
              setQuestion={(question) => {
                setQuestions((questions) =>
                  questions?.map((q) => (q.id === question.id ? question : q))
                );
              }}
              href={locations.showQuestion.replace(":id", String(question.id))}
              key={question.id}
              showChoices
              showStartButton
            />
          ))
        ) : (
          <Text>問題は存在しません。</Text>
        )
      ) : (
        <Loading />
      )}
      <Button as={Link} to={locations.createQuestion} colorScheme="teal">
        問題を作成
      </Button>
    </VStack>
  );
});

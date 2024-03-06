import { Button, VStack } from "@chakra-ui/react";
import { createChoice } from "api/choice";
import { createEmptyQuestion, createQuestion } from "api/questions";
import locations from "locations";
import { FormEvent, memo, useCallback, useState } from "react";
import { IoDocument } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import QuestionForm from "./QuestionForm";

export default memo(function CreateQuestion() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState(createEmptyQuestion());

  const handleCreateQuestion = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const savedQuestion = await createQuestion(question);
      await Promise.all(
        question.choices.map((choice, index) =>
          createChoice({
            ...choice,
            question_id: savedQuestion.id,
            display_order: index,
          })
        )
      );
      navigate(locations.showQuestion.replace(":id", String(savedQuestion.id)));
    },
    [question, navigate]
  );

  return (
    <VStack
      as={"form"}
      onSubmit={handleCreateQuestion}
      gap={4}
      alignItems={"stretch"}
    >
      <QuestionForm
        question={question}
        onChange={({ question }) => {
          setQuestion(question);
        }}
      />
      <Button type={"submit"} colorScheme="teal" leftIcon={<IoDocument />}>
        作成
      </Button>
    </VStack>
  );
});

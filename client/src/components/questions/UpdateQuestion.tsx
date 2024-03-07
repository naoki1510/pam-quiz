import { Button, Heading, VStack } from "@chakra-ui/react";
import { createChoice, deleteChoice, updateChoice } from "api/choice";
import { updateQuestion, useQuestion } from "api/questions";
import Loading from "components/common/Loading";
import QuestionForm from "components/questions/QuestionForm";
import locations from "locations";
import { FormEvent, memo, useCallback, useState } from "react";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";

export default memo(function UpdateQuestion() {
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

  const [deletedChoiceIds, setDeletedChoiceIds] = useState<number[]>([]);

  const handleUpdateQuestion = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!question) return;
      await Promise.all(
        deletedChoiceIds.map((id) => {
          return deleteChoice(id);
        })
      );
      const { choices, ...questionWithoutChoices } = question;
      const savedQuestion = await updateQuestion(questionWithoutChoices);
      await Promise.all(
        choices.map((choice, index) => {
          if (choice.id) {
            return updateChoice({ ...choice, display_order: index });
          } else {
            return createChoice({
              ...choice,
              question_id: savedQuestion.id,
              display_order: index,
            });
          }
        })
      );

      navigate(locations.showQuestion.replace(":id", String(savedQuestion.id)));
    },
    [question, navigate]
  );

  return question ? (
    <VStack
      as={"form"}
      onSubmit={handleUpdateQuestion}
      alignItems={"stretch"}
      flex={1}
      gap={4}
    >
      <Heading>問題の編集</Heading>
      <QuestionForm
        question={question}
        onChange={({ question, deletedChoiceIds }) => {
          setQuestion(question);
          setDeletedChoiceIds(deletedChoiceIds);
        }}
      />
      <VStack alignItems={"stretch"} gap={2}>
        <Button type={"submit"} colorScheme="teal" leftIcon={<IoCheckmark />}>
          保存
        </Button>
        <Button
          as={Link}
          to={locations.showQuestion.replace(":id", String(question.id))}
          colorScheme="teal"
          variant={"outline"}
          leftIcon={<IoClose />}
        >
          キャンセル
        </Button>
      </VStack>
    </VStack>
  ) : (
    <Loading />
  );
});

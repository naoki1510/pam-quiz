import {
  Button,
  List,
  ListItem,
  Progress,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Choice } from "api/choice";
import { Question } from "api/questions";
import QuestionCard from "components/questions/QuestionCard";
import React, { memo, useCallback } from "react";
import { IoCheckmark } from "react-icons/io5";

export type AnswerFormProps = {
  question: Question;
  selectedChoices?: Choice[];
  setSelectedChoices?: React.Dispatch<React.SetStateAction<Choice[]>>;
};

export default memo(function AnswerForm(props: AnswerFormProps) {
  const { question, selectedChoices, setSelectedChoices } = props;

  const handleSelect = useCallback(
    (choice: Choice) => () => {
      if (!setSelectedChoices) return;
      setSelectedChoices((choices) => {
        switch (question.question_type) {
          case "single":
            return [
              ...choices.filter((c) => c.question_id !== question.id),
              choice,
            ];
          case "multiple":
            return choices.some((c) => c.id === choice.id)
              ? choices.filter((c) => c.id !== choice.id)
              : [...choices, choice];
          default:
            return choices;
        }
      });
    },
    [question, setSelectedChoices]
  );

  return (
    <VStack alignItems={"stretch"} gap={4}>
      <QuestionCard question={question} />
      <Text>残り時間 : {Math.floor(question.until_end ?? 0)}秒</Text>
      <Progress value={Math.floor(question.until_end ?? 0) / 0.3} />
      <Text>あなたの回答は…</Text>
      <List
        display={"flex"}
        gap={2}
        flexDirection={"column"}
        alignItems={"stretch"}
      >
        {question.choices.map((choice) => (
          <ListItem key={choice.id}>
            <Button
              onClick={
                choice.id !== undefined ? handleSelect(choice) : undefined
              }
              w={"full"}
              colorScheme="teal"
              variant={
                selectedChoices?.some((c) => c.id === choice.id)
                  ? "solid"
                  : "outline"
              }
              leftIcon={
                selectedChoices?.some((c) => c.id === choice.id) ? (
                  <IoCheckmark />
                ) : undefined
              }
            >
              {choice.description}
            </Button>
          </ListItem>
        ))}
      </List>
    </VStack>
  );
});

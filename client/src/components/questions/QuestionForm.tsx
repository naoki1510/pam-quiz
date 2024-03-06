import {
  Button,
  Card,
  CardBody,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Choice, createEmptyChoice } from "api/choice";
import { Question } from "api/questions";
import ChoiceForm from "components/choices/ChoiceForm";
import { memo, useCallback, useState } from "react";
import { IoAdd } from "react-icons/io5";

export type QuestionFormProps = {
  onChange?: (value: {
    question: Question;
    deletedChoiceIds: number[];
  }) => void;
  question: Question;
};

export default memo(function QuestionForm(props: QuestionFormProps) {
  const { onChange, question } = props;
  const { title, image, choices, point } = question;
  const [deletedChoiceIds, setDeletedChoiceIds] = useState<number[]>([]);

  const handleChange = useCallback(
    (question: Question) => {
      onChange?.({ question, deletedChoiceIds });
    },
    [onChange]
  );

  const handleChangeTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleChange({ ...question, title: e.target.value });
    },
    [question, handleChange]
  );

  const handleChangeImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleChange({ ...question, image: e.target.value });
    },
    [question, handleChange]
  );

  const handleChangeChoice = useCallback(
    (index: number) => (choice: Choice) => {
      handleChange({
        ...question,
        choices: [
          ...choices.slice(0, index),
          choice,
          ...choices.slice(index + 1),
        ],
      });
    },
    [question, handleChange]
  );

  const handleAddChoice = useCallback(() => {
    handleChange({ ...question, choices: [...choices, createEmptyChoice()] });
  }, [question, handleChange, choices]);

  const handleDeleteChoice = useCallback(
    (index: number) => () => {
      const choice = choices[index];
      if (choice.id !== undefined) {
        setDeletedChoiceIds([...deletedChoiceIds, choice.id]);
      }
      handleChange({
        ...question,
        choices: [...choices.slice(0, index), ...choices.slice(index + 1)],
      });
    },
    [question, handleChange, choices]
  );

  const handleReplaceChoice = useCallback(
    (from: number, to: number) => {
      const newChoices = [...choices];
      const [removed] = newChoices.splice(from, 1);
      newChoices.splice(to, 0, removed);
      handleChange({ ...question, choices: newChoices });
    },
    [question, handleChange, choices]
  );

  const handleChangePoint = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleChange({ ...question, point: Number(e.target.value) });
    },
    [question, handleChange]
  );

  return (
    <VStack
      gap={{ base: 2, md: 4 }}
      divider={<Divider />}
      alignItems={"stretch"}
    >
      <FormControl>
        <FormLabel>問題</FormLabel>
        <Input
          value={title}
          onChange={handleChangeTitle}
          placeholder={"SiCとGaNで電子移動度が高いのはどちらか？"}
          maxLength={255}
        />
        <FormHelperText>問題を入力してください。（255文字以内）</FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>画像</FormLabel>
        <Input
          value={image}
          onChange={handleChangeImage}
          placeholder={"/images/question-00.png"}
          maxLength={255}
        />
        <FormHelperText>
          画像のURLを入力してください。（255文字以内）
        </FormHelperText>
      </FormControl>
      <VStack alignItems={"stretch"} gap={4}>
        <Text>選択肢</Text>
        {choices.map((choice, index) => (
          <Card key={index} variant={"outline"}>
            <CardBody>
              <ChoiceForm
                choice={choice}
                onChange={handleChangeChoice(index)}
                onDelete={handleDeleteChoice(index)}
                onMoveUp={
                  index
                    ? () => handleReplaceChoice(index, index - 1)
                    : undefined
                }
                onMoveDown={
                  index + 1 < choices.length
                    ? () => handleReplaceChoice(index, index + 1)
                    : undefined
                }
              />
            </CardBody>
          </Card>
        ))}
        <Button
          colorScheme="teal"
          onClick={handleAddChoice}
          ml={"auto"}
          leftIcon={<IoAdd />}
        >
          選択肢を追加
        </Button>
      </VStack>
      <FormControl>
        <FormLabel>配点</FormLabel>
        <Input
          type={"number"}
          placeholder={"1"}
          value={point}
          onChange={handleChangePoint}
        />
      </FormControl>
    </VStack>
  );
});

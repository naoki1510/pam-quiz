import {
  Box,
  Button,
  Card,
  CardBody,
  Collapse,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Select,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Choice, createEmptyChoice } from "api/choice";
import { Question } from "api/questions";
import ChoiceForm from "components/choices/ChoiceForm";
import { memo, useCallback, useState } from "react";
import { IoAdd, IoCaretDown, IoCaretForward } from "react-icons/io5";

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
  const [rawPoint, setRawPoint] = useState(String(point));
  const [rawDisplayOrder, setRawDisplayOrder] = useState(
    String(question.display_order ?? "")
  );
  const [deletedChoiceIds, setDeletedChoiceIds] = useState<number[]>([]);
  const { isOpen: isOpenImage, onToggle: onToggleImage } = useDisclosure();

  const handleChange = useCallback(
    (question: Question) => {
      onChange?.({ question, deletedChoiceIds });
    },
    [onChange]
  );

  const handleChangeOrder = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRawDisplayOrder(e.target.value);
      handleChange({
        ...question,
        display_order: e.target.value === "" ? null : Number(e.target.value),
      });
    },
    [question, handleChange]
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

  const handleChangeType = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      switch (e.target.value) {
        case "single":
          handleChange({ ...question, question_type: "single" });
          break;
        case "multiple":
          handleChange({ ...question, question_type: "multiple" });
          break;
      }
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
      setRawPoint(e.target.value);
      handleChange({ ...question, point: Number(e.target.value) });
    },
    [question, handleChange]
  );

  return (
    <VStack gap={4} alignItems={"stretch"}>
      <FormControl>
        <FormLabel>問題番号</FormLabel>
        <Input
          type={"number"}
          value={rawDisplayOrder}
          onChange={handleChangeOrder}
          placeholder={"未入力の場合、末尾になります。"}
        />
      </FormControl>
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
        <FormLabel>問題タイプ</FormLabel>
        <Select value={question.question_type} onChange={handleChangeType}>
          <option value={"single"}>単一選択</option>
          <option value={"multiple"}>複数選択</option>
        </Select>
      </FormControl>
      <FormControl>
        <Button
          leftIcon={isOpenImage ? <IoCaretDown /> : <IoCaretForward />}
          variant={"link"}
          onClick={onToggleImage}
        >
          画像
        </Button>
        <Collapse in={isOpenImage}>
          <Box pt={4}>
            <Input
              value={image}
              onChange={handleChangeImage}
              placeholder={"/images/question-00.png"}
              maxLength={255}
            />
            <FormHelperText>
              画像のURLを入力してください。（255文字以内）
            </FormHelperText>
          </Box>
        </Collapse>
      </FormControl>
      <VStack alignItems={"stretch"} gap={4}>
        <Text fontWeight={"medium"}>選択肢</Text>
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
          value={rawPoint}
          onChange={handleChangePoint}
        />
      </FormControl>
    </VStack>
  );
});

import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  VStack,
} from "@chakra-ui/react";
import { Choice } from "api/choice";
import { memo, useCallback, useMemo } from "react";
import { IoArrowDown, IoArrowUp, IoTrash } from "react-icons/io5";

export type CreateChoiceProps = {
  onChange?: (value: Choice) => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  choice: Choice;
};

export default memo(function ChoiceForm(props: CreateChoiceProps) {
  const placeholder = useMemo(
    () => ["GaN", "SiC"][Math.floor(Math.random() * 2)],
    []
  );
  const { onChange, onDelete, onMoveDown, onMoveUp, choice } = props;
  const { description, image, is_correct: isCorrect } = choice;

  const handleChange = useCallback(
    (choice: Choice) => {
      onChange?.(choice);
    },
    [onChange]
  );

  const handleChangeDescription = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleChange({ ...choice, description: e.target.value });
    },
    [choice, handleChange]
  );

  const handleChangeImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleChange({ ...choice, image: e.target.value });
    },
    [choice, handleChange]
  );

  const handleChangeIsCorrect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleChange({ ...choice, is_correct: e.target.checked });
    },
    [choice, handleChange]
  );

  return (
    <VStack gap={4} alignItems={"stretch"}>
      <FormControl>
        <FormLabel>回答</FormLabel>
        <Input
          value={description}
          onChange={handleChangeDescription}
          placeholder={placeholder}
          maxLength={255}
        />
      </FormControl>
      <FormControl>
        <FormLabel>画像</FormLabel>
        <Input
          value={image}
          onChange={handleChangeImage}
          placeholder={"/images/question-00/choice-00.png"}
          maxLength={255}
        />
      </FormControl>
      <Checkbox isChecked={isCorrect} onChange={handleChangeIsCorrect}>
        正解
      </Checkbox>
      <HStack>
        <IconButton
          aria-label="move up"
          icon={<IoArrowUp />}
          onClick={onMoveUp}
          isDisabled={!onMoveUp}
          variant={"outline"}
        />
        <IconButton
          aria-label="move down"
          icon={<IoArrowDown />}
          onClick={onMoveDown}
          isDisabled={!onMoveDown}
          variant={"outline"}
        />
        <Button
          onClick={onDelete}
          colorScheme="red"
          variant={"link"}
          leftIcon={<IoTrash />}
          ml={"auto"}
        >
          削除
        </Button>
      </HStack>
    </VStack>
  );
});

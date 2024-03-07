import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  HStack,
  Heading,
  Image,
  List,
  ListIcon,
  ListItem,
  Text,
} from "@chakra-ui/react";
import {
  Question,
  deleteQuestion,
  endQuestion,
  resetQuestion,
  startQuestion,
} from "api/questions";
import locations from "locations";
import { memo, useCallback } from "react";
import {
  IoCheckmark,
  IoClose,
  IoPencil,
  IoPlayCircle,
  IoRemove,
  IoStopCircle,
  IoTrash,
} from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userIdState from "recoil/userIdState";

export type ShowQuestionProps = {
  question: Question;
  setQuestion?: (question: Question) => void;
  showChoices?: boolean;
  showActions?: boolean;
  href?: string;
};

export default memo(function QuestionCard(props: ShowQuestionProps) {
  const { question, setQuestion, href, showChoices, showActions } = props;
  const { title, image, point } = question;
  const userId = useRecoilValue(userIdState);
  const navigate = useNavigate();

  const handleStart = useCallback(() => {
    if (question.id !== undefined)
      startQuestion(
        question.id,
        new URLSearchParams({ show_correct: "true" })
      ).then(setQuestion);
  }, [question.id]);

  const handleEnd = useCallback(() => {
    if (question.id !== undefined)
      endQuestion(
        question.id,
        new URLSearchParams({ show_correct: "true" })
      ).then(setQuestion);
  }, [question.id]);

  const handleDelete = useCallback(() => {
    if (question.id !== undefined)
      deleteQuestion(question.id).then(() => {
        navigate(locations.listQuestions);
      });
  }, [question.id]);

  const handleReset = useCallback(() => {
    if (question.id !== undefined)
      resetQuestion(
        question.id,
        new URLSearchParams({ show_correct: "true" })
      ).then(setQuestion);
  }, [question.id]);

  return (
    <Card>
      <CardBody
        {...(href && { as: Link, to: href })}
        display={"flex"}
        flexDir={"column"}
        gap={4}
      >
        <Heading size={"md"} variant={"h2"}>
          {title}
        </Heading>
        {image && <Image src={image} alt={title} w={"full"} rounded={"md"} />}
        <HStack>
          <Badge>{point}点</Badge>
        </HStack>
        {showChoices && (
          <List>
            {question.choices.map((choice) => (
              <ListItem key={choice.id}>
                {choice.is_correct ? (
                  <ListIcon as={IoCheckmark} color={"teal.500"} />
                ) : choice.answers.some(
                    (answer) => answer.user_id === userId
                  ) ? (
                  <ListIcon as={IoClose} color={"red.500"} />
                ) : (
                  <ListIcon as={IoRemove} color={"gray.500"} />
                )}
                {choice.description}
              </ListItem>
            ))}
          </List>
        )}
      </CardBody>
      {showActions && (
        <CardFooter gap={2} alignItems={"center"}>
          {question.until_end ? (
            <>
              <Button
                onClick={handleEnd}
                leftIcon={<IoStopCircle />}
                colorScheme="red"
              >
                終了
              </Button>
              <Text>あと{Math.round(question.until_end)}秒</Text>
            </>
          ) : (
            <>
              <Button
                onClick={handleStart}
                leftIcon={<IoPlayCircle />}
                colorScheme="green"
              >
                開始
              </Button>
              {question.is_finished && (
                <Button
                  colorScheme="red"
                  onClick={handleReset}
                  leftIcon={<IoClose />}
                  variant={"outline"}
                >
                  リセット
                </Button>
              )}
            </>
          )}
          <Button
            as={Link}
            to={locations.updateQuestion.replace(":id", String(question.id))}
            leftIcon={<IoPencil />}
            variant={"outline"}
            colorScheme="blue"
            ml={"auto"}
          >
            編集
          </Button>
          <Button
            onClick={handleDelete}
            colorScheme="red"
            leftIcon={<IoTrash />}
            variant={"outline"}
          >
            削除
          </Button>
        </CardFooter>
      )}
    </Card>
  );
});

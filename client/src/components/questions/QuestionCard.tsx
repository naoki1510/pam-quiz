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
  openAnswer,
  resetQuestion,
  startQuestion,
} from "api/questions";
import locations from "locations";
import { memo, useCallback } from "react";
import {
  IoCheckmark,
  IoClose,
  IoDocumentText,
  IoPencil,
  IoPlayCircle,
  IoRefresh,
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
  const { display_order, title, image, point, question_type } = question;
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
      confirm("問題を削除してよろしいですか？") &&
        deleteQuestion(question.id).then(() => {
          navigate(locations.listQuestions);
        });
  }, [question.id]);

  const handleReset = useCallback(() => {
    if (question.id !== undefined)
      confirm("回答を削除してよろしいですか？") &&
        resetQuestion(
          question.id,
          new URLSearchParams({ show_correct: "true" })
        ).then(setQuestion);
  }, [question.id]);

  const handleOpenAnswer = useCallback(() => {
    if (question.id !== undefined)
      openAnswer(
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
          第{display_order}問 {title}
        </Heading>
        {image && <Image src={image} alt={title} w={"full"} rounded={"md"} />}
        <HStack>
          <Badge colorScheme={point !== 1 ? "orange" : "gray"}>{point}点</Badge>
          <Badge colorScheme={question_type !== "single" ? "orange" : "gray"}>
            {
              {
                single: "単一選択",
                multiple: "複数選択",
              }[question_type]
            }
          </Badge>
        </HStack>
        {showChoices && (
          <List>
            {question.choices.map((choice) => {
              const isSelected = choice.answers.some(
                (answer) => answer.user_id === userId
              );
              return (
                <ListItem
                  key={choice.id}
                  fontWeight={isSelected ? "bold" : "normal"}
                >
                  {choice.is_correct ? (
                    <ListIcon as={IoCheckmark} color={"teal.500"} />
                  ) : isSelected && question.status === "answer_opened" ? (
                    <ListIcon as={IoClose} color={"red.500"} />
                  ) : (
                    <ListIcon as={IoRemove} color={"gray.500"} />
                  )}
                  {choice.description} {choice.is_correct && "(正解)"}{" "}
                  {isSelected && "(あなたの答え)"} {choice.answers.length}人
                </ListItem>
              );
            })}
          </List>
        )}
      </CardBody>
      {showActions && (
        <CardFooter gap={2} alignItems={"center"}>
          {question.status === "active" ? (
            <>
              <Button
                onClick={handleEnd}
                leftIcon={<IoStopCircle />}
                colorScheme="red"
              >
                終了
              </Button>
              <Text>あと{Math.round(question.until_end ?? 0)}秒</Text>
            </>
          ) : question.status === "finished" ? (
            <Button
              onClick={handleOpenAnswer}
              leftIcon={<IoDocumentText />}
              colorScheme="yellow"
            >
              解答
            </Button>
          ) : question.status === "answer_opened" ? (
            <Button
              onClick={handleStart}
              leftIcon={<IoRefresh />}
              colorScheme="red"
            >
              やり直し
            </Button>
          ) : (
            <Button
              onClick={handleStart}
              leftIcon={<IoPlayCircle />}
              colorScheme="green"
            >
              開始
            </Button>
          )}
          <HStack ml={"auto"} gap={4} alignSelf={"end"}>
            {question.is_finished && (
              <Button
                onClick={handleReset}
                leftIcon={<IoClose />}
                variant={"link"}
                colorScheme="red"
              >
                回答削除
              </Button>
            )}
            <Button
              as={Link}
              to={locations.updateQuestion.replace(":id", String(question.id))}
              leftIcon={<IoPencil />}
              variant={"link"}
              colorScheme="blue"
            >
              編集
            </Button>
            <Button
              onClick={handleDelete}
              leftIcon={<IoTrash />}
              variant={"link"}
              colorScheme="red"
            >
              削除
            </Button>
          </HStack>
        </CardFooter>
      )}
    </Card>
  );
});

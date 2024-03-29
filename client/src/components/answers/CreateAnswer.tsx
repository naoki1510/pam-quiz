import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { createAnswer } from "api/answer";
import { Choice } from "api/choice";
import { useQuestions } from "api/questions";
import { useUser } from "api/users";
import Loading from "components/common/Loading";
import QuestionCard from "components/questions/QuestionCard";
import locations from "locations";
import { memo, useCallback, useEffect, useState } from "react";
import { IoExitOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import userIdState from "recoil/userIdState";
import AnswerForm from "./AnswerForm";

let previousQuestionIds: number[] = [];

export default memo(function CreateAnswer() {
  const navigate = useNavigate();
  const [userId, setUserID] = useRecoilState(userIdState);
  useEffect(() => {
    if (userId === undefined) {
      navigate(locations.createUser);
    }
  }, [navigate]);

  const [selectedChoices, setSelectedChoices] = useState<Choice[]>([]);

  const { questions, fetchQuestions } = useQuestions(
    new URLSearchParams({ active: "true" })
  );
  const { questions: lastQuestions, fetchQuestions: fetchLastQuestions } =
    useQuestions(new URLSearchParams({ last: "true" }));
  const { user } = useUser(userId || "");

  useEffect(() => {
    if (!questions) return;

    previousQuestionIds.map(async (id) => {
      if (questions.every((question) => question.id !== id)) {
        await Promise.all(
          selectedChoices
            .filter((choice) => choice.question_id === id)
            .map((choice) => {
              if (choice.id && userId)
                return createAnswer({
                  choice_id: choice.id,
                  user_id: userId,
                });
            })
        );
        setSelectedChoices([]);
        fetchLastQuestions();
      }
    });

    previousQuestionIds = questions.flatMap((question) =>
      question.id !== undefined ? [question.id] : []
    );

    if (questions?.some((question) => question.until_end !== undefined)) return;
    const interval = setInterval(() => {
      fetchQuestions();
      fetchLastQuestions();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchQuestions, questions]);

  const handleLogout = useCallback(() => {
    setUserID(undefined);
    navigate(locations.createUser);
  }, [navigate]);

  return (
    <VStack alignItems={"stretch"} flex={1} gap={4}>
      <Card variant={"outline"}>
        <CardBody>
          <HStack>
            <Box flex={1}>
              <Heading size={"sm"}>
                {user?.name}
                <Text as={"span"} fontWeight={"normal"}>
                  さん
                </Text>
              </Heading>
            </Box>
            <Button
              leftIcon={<IoExitOutline />}
              onClick={handleLogout}
              colorScheme="red"
              variant={"link"}
            >
              ログアウト
            </Button>
          </HStack>
        </CardBody>
      </Card>
      {questions?.length ? (
        questions.map((question) => (
          <>
            <AnswerForm
              question={question}
              key={question.id}
              selectedChoices={selectedChoices}
              setSelectedChoices={setSelectedChoices}
            />
            <Alert status="warning" rounded={"md"}>
              <AlertIcon />
              回答時間が終わるまでこの画面から移動しないでください。
            </Alert>
          </>
        ))
      ) : lastQuestions?.length ? (
        <>
          {lastQuestions.map((question) => (
            <VStack key={question.id} alignItems={"stretch"}>
              <QuestionCard question={question} showChoices />
            </VStack>
          ))}
        </>
      ) : questions && lastQuestions ? (
        <Text>クイズが開始されるまでお待ちください。</Text>
      ) : (
        <Loading />
      )}
    </VStack>
  );
});

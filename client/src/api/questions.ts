import { Choice, createEmptyChoice } from "api/choice";
import { getHeaders, postHeaders } from "api/headers";
import host from "api/host";
import { useCallback, useEffect, useState } from "react";

export type Question = {
  id?: number;
  title: string;
  image: string;
  question_type: "single" | "multiple";
  display_order?: number;
  point: number;
  choices: Choice[];
  until_end?: number;
  is_finished: boolean;
  status?: "active" | "finished" | "answer_opened" | "waiting";
};

export const createEmptyQuestion = (): Question => {
  return {
    title: "",
    image: "",
    question_type: "single",
    point: 1,
    choices: [createEmptyChoice()],
    is_finished: false,
  };
};

export const getQuestions = (
  params?: URLSearchParams,
  controller?: AbortController
) => {
  return fetch(`${host}/questions?${params}`, {
    method: "GET",
    headers: getHeaders,
    signal: controller?.signal,
  }).then((res) => res.json() as Promise<Question[]>);
};

export const getQuestion = (
  id: string | number,
  params?: URLSearchParams,
  controller?: AbortController
) => {
  return fetch(`${host}/questions/${id}?${params}`, {
    method: "GET",
    headers: getHeaders,
    signal: controller?.signal,
  }).then((res) => res.json() as Promise<Question>);
};

export type CreateQuestionParams = Omit<Question, "id" | "choices">;

export const createQuestion = (
  params: CreateQuestionParams,
  controller?: AbortController
) => {
  return fetch(`${host}/questions`, {
    method: "POST",
    headers: postHeaders,
    body: JSON.stringify(params),
    signal: controller?.signal,
  }).then((res) => res.json() as Promise<Question>);
};

export type UpdateQuestionParams = Omit<Question, "choices">;

export const updateQuestion = (
  params: UpdateQuestionParams,
  controller?: AbortController
) => {
  return fetch(`${host}/questions/${params.id}`, {
    method: "PATCH",
    headers: postHeaders,
    body: JSON.stringify(params),
    signal: controller?.signal,
  }).then((res) => res.json() as Promise<Question>);
};

export const deleteQuestion = (
  id: string | number,
  controller?: AbortController
) => {
  return fetch(`${host}/questions/${id}`, {
    method: "DELETE",
    headers: postHeaders,
    signal: controller?.signal,
  });
};

export const startQuestion = (
  id: string | number,
  params?: URLSearchParams,
  controller?: AbortController
) => {
  return fetch(`${host}/questions/${id}/start?${params}`, {
    method: "GET",
    headers: getHeaders,
    signal: controller?.signal,
  }).then((res) => res.json() as Promise<Question>);
};

export const endQuestion = (
  id: string | number,
  params?: URLSearchParams,
  controller?: AbortController
) => {
  return fetch(`${host}/questions/${id}/end?${params}`, {
    method: "GET",
    headers: getHeaders,
    signal: controller?.signal,
  }).then((res) => res.json() as Promise<Question>);
};

export const resetQuestion = (
  id: string | number,
  params?: URLSearchParams,
  controller?: AbortController
) => {
  return fetch(`${host}/questions/${id}/reset?${params}`, {
    method: "GET",
    headers: getHeaders,
    signal: controller?.signal,
  }).then((res) => res.json() as Promise<Question>);
};

export const openAnswer = (
  id: string | number,
  params?: URLSearchParams,
  controller?: AbortController
) => {
  return fetch(`${host}/questions/${id}/open_answer?${params}`, {
    method: "GET",
    headers: getHeaders,
    signal: controller?.signal,
  }).then((res) => res.json() as Promise<Question>);
};

export const useQuestions = (params?: URLSearchParams) => {
  const [questions, setQuestions] = useState<Question[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const paramsString = params?.toString();

  const fetchQuestions = useCallback(
    (controller?: AbortController) => {
      setLoading(true);
      getQuestions(new URLSearchParams(paramsString), controller)
        .then(setQuestions)
        .catch(setError)
        .finally(() => setLoading(false));
    },
    [paramsString]
  );

  useEffect(() => {
    const until_end = questions?.reduce(
      (min_until_end, question) =>
        Math.min(min_until_end, question?.until_end ?? Infinity),
      Infinity
    );
    if (until_end !== undefined && until_end !== Infinity) {
      const timeout = setTimeout(() => {
        fetchQuestions();
      }, (until_end % 1) * 1000);
      return () => clearTimeout(timeout);
    }
  }, [questions, fetchQuestions]);

  useEffect(() => {
    const controller = new AbortController();
    fetchQuestions(controller);

    return () => {
      controller.abort();
    };
  }, [fetchQuestions]);

  return { questions, loading, error, setQuestions, fetchQuestions };
};

export const useQuestion = (id: string | number, params?: URLSearchParams) => {
  const [question, setQuestion] = useState<Question>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const paramsString = params?.toString();

  const fetchQuestion = useCallback(
    (controller?: AbortController) => {
      setLoading(true);
      getQuestion(id, new URLSearchParams(paramsString), controller)
        .then(setQuestion)
        .catch(setError)
        .finally(() => setLoading(false));
    },
    [id, paramsString]
  );

  useEffect(() => {
    if (question?.until_end) {
      const timeout = setTimeout(() => {
        fetchQuestion();
      }, (question.until_end % 1) * 1000);
      return () => clearTimeout(timeout);
    }
  }, [question, fetchQuestion]);

  useEffect(() => {
    const controller = new AbortController();
    fetchQuestion(controller);

    return () => {
      controller.abort();
    };
  }, [fetchQuestion]);

  return { question, loading, error, setQuestion, fetchQuestion };
};

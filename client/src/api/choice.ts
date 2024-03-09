import { postHeaders } from "api/headers";
import host from "api/host";
import { Answer } from "./answer";

export type Choice = {
  id?: number;
  question_id?: number;
  title: string;
  description: string;
  image: string;
  display_order?: number;
  is_correct?: boolean;
  answers: Answer[];
};

export const createEmptyChoice = (questionId?: number): Choice => {
  return {
    question_id: questionId,
    title: "",
    description: "",
    image: "",
    is_correct: false,
    answers: [],
  };
};

export type createChoiceProps = Omit<Choice, "id">;

export const createChoice = (props: createChoiceProps) => {
  return fetch(`${host}/choices`, {
    method: "POST",
    headers: postHeaders,
    body: JSON.stringify(props),
  }).then((res) => res.json() as Promise<Choice>);
};

export const updateChoice = (props: Choice) => {
  return fetch(`${host}/choices/${props.id}`, {
    method: "PATCH",
    headers: postHeaders,
    body: JSON.stringify(props),
  }).then((res) => res.json() as Promise<Choice>);
};

export const deleteChoice = (id: string | number) => {
  return fetch(`${host}/choices/${id}`, {
    method: "DELETE",
    headers: postHeaders,
  });
};

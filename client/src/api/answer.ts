import { postHeaders } from "api/headers";
import host from "api/host";

export type Answer = {
  id?: number;
  user_id: number;
  choice_id: number;
  username?: string;
  choice?: string;
};

export type CreateAnswerParams = {
  user_id: string | number;
  choice_id: string | number;
};

export const createAnswer = (params: CreateAnswerParams) => {
  return fetch(`${host}/answers`, {
    method: "POST",
    headers: postHeaders,
    body: JSON.stringify(params),
  }).then((res) => res.json() as Promise<Answer>);
};

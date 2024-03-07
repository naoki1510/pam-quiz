import { postHeaders } from "api/headers";
import host from "api/host";
import { useCallback, useEffect, useState } from "react";

export type User = {
  id: number;
  name: string;
  point: number;
};

export const getUsers = (controller?: AbortController) => {
  return fetch(`${host}/users`, {
    method: "GET",
    headers: postHeaders,
    signal: controller?.signal,
  }).then((res) => res.json() as Promise<User[]>);
};

export const getUser = (id: string | number, controller?: AbortController) => {
  return fetch(`${host}/users/${id}`, {
    method: "GET",
    headers: postHeaders,
    signal: controller?.signal,
  }).then((res) => res.json() as Promise<User>);
};

export type CreateUserParams = {
  name: string;
};

export const createUser = (params: CreateUserParams) => {
  return fetch(`${host}/users`, {
    method: "POST",
    headers: postHeaders,
    body: JSON.stringify(params),
  }).then((res) => res.json() as Promise<User>);
};

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback((controller?: AbortController) => {
    setLoading(true);
    getUsers(controller)
      .then((users) => {
        setUsers(users);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchUsers(controller);

    return () => {
      controller.abort();
    };
  }, [fetchUsers]);

  return { users, loading, error, fetchUsers };
};

export const useUser = (id: string | number) => {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(
    (controller?: AbortController) => {
      setLoading(true);
      getUser(id, controller)
        .then((user) => {
          setUser(user);
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [id]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchUser(controller);

    return () => {
      controller.abort();
    };
  }, [fetchUser]);

  return { user, loading, error, fetchUser };
};

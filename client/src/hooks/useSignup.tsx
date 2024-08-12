import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { BASE_URL } from "../App";

interface SignupData {
  username: string;
  password: string;
}

export const useSignup = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch: dispatchTree } = useAuthContext();

  const signup = async ({
    username,
    password,
  }: SignupData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: username,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("treeToken", data.token);

      dispatchTree({ type: "LOGIN", payload: data.token });
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    setError(data.error);
    return false;
  };

  return { signup, isLoading, error };
};

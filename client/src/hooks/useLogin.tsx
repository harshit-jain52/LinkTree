import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

interface LoginData {
  username: string;
  password: string;
}

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch: dispatchTree } = useAuthContext();

  const login = async ({ username, password }: LoginData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`http://localhost:5000/api/login`, {
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
    //   console.log(`Login successful ${localStorage.getItem("treeToken")}`);
      return true;
    }

    setIsLoading(false);
    setError(data.error);
    return false;
  };

  return { login, isLoading, error };
};

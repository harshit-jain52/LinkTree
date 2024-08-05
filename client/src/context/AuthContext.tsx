import { createContext, useReducer, useEffect, ReactNode } from "react";

interface Tree {
  token: string;
  treeName: string;
}

interface AuthState {
  isAuthenticated: boolean;
  tree: Tree | null;
}

interface AuthAction {
  type: "LOGIN" | "LOGOUT";
  payload?: Tree;
}

export const AuthContext = createContext<
  { state: AuthState; dispatch: React.Dispatch<AuthAction> } | undefined
>(undefined);

export const authReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        isAuthenticated: true,
        tree: action.payload || null,
      };
    case "LOGOUT":
      return {
        isAuthenticated: false,
        tree: null,
      };
    default:
      return state;
  }
};

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    tree: null,
  });

  useEffect(() => {
    const tree = JSON.parse(localStorage.getItem("tree") || "null");

    const checkAuth = async () => {
      const response = await fetch(`/api/trees/auth`, {
        headers: {
          Authorization: `Bearer ${tree?.token}`,
        },
      });
      const data = await response.json();
      if (data.error) {
        dispatch({ type: "LOGOUT" });
      } else if (tree) {
        dispatch({ type: "LOGIN", payload: tree });
      }
    };

    if (tree) {
      checkAuth();
    }
  }, []);

  console.log("AuthContext state:", state);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

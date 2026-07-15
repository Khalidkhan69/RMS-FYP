import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem("adminToken");
    const role = localStorage.getItem("adminRole");

    if (token && role) {

      setUser({
        token,
        role,
      });

    }

    setLoading(false);

  }, []);

  const login = (token, role) => {

    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminRole", role);

    setUser({
      token,
      role,
    });

  };

  const logout = () => {

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");

    setUser(null);

  };

  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>

  );

}

export function useAuth() {
  return useContext(AuthContext);
}
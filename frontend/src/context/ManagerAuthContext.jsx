import { createContext, useContext, useEffect, useState } from "react";

const ManagerAuthContext = createContext();

export function ManagerAuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem("managerToken");
    const role = localStorage.getItem("managerRole");

    if (token && role) {

      setUser({
        token,
        role,
      });

    }

    setLoading(false);

  }, []);

  const login = (token, role) => {

    localStorage.setItem("managerToken", token);
    localStorage.setItem("managerRole", role);

    setUser({
      token,
      role,
    });

  };

  const logout = () => {

    localStorage.removeItem("managerToken");
    localStorage.removeItem("managerRole");

    setUser(null);

  };

  return (

    <ManagerAuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </ManagerAuthContext.Provider>

  );

}

export function useManagerAuth() {
  return useContext(ManagerAuthContext);
}
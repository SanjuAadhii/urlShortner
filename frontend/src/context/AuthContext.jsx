import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  signIn: () => {},
  signOut: () => {},
  urls: [],
  apiUrl: "",
  authtoken: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const [urls, setUrls] = useState(
    () => JSON.parse(localStorage.getItem("urls")) || []
  );
  const apiUrl = import.meta.env.VITE_API_URL;

  const signIn = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("urls", JSON.stringify(urls));
    setIsAuthenticated(true);
    setUser(userData);
    setAuthToken(token);
  };

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    setUrls([]);
    setAuthToken(null);
  };

  const validateToken = async (token) => {
    try {
      const response = await fetch(`${apiUrl}/auth/validatetoken`, {
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
        method: "GET",
      });
      return response.ok;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));
    if (token) {
      validateToken(token).then((isValid) => {
        setIsAuthenticated(isValid);
        if (!isValid) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("urls");
          setUser(null);
        } else {
          setIsAuthenticated(true);
          setUser(userData);
          setUrls(JSON.parse(localStorage.getItem("urls")) || []);
        }
      });
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  // Sync logout across tabs
  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === "token" && !event.newValue) {
        signOut();
      }
    };

    window.addEventListener("storage", syncLogout);
    return () => {
      window.removeEventListener("storage", syncLogout);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        signIn,
        user,
        signOut,
        apiUrl,
        urls,
        setUrls,
        authToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

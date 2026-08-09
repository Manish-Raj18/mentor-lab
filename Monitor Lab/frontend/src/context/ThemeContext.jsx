import {
  createContext,
  useState
}
from "react";

export const ThemeContext =
createContext();

function ThemeProvider({
  children
}){

  const [darkMode,setDarkMode]
  = useState(true);

  return(

    <ThemeContext.Provider value={{darkMode,setDarkMode }}>

      {children}

    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
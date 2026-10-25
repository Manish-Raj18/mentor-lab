import {
  useState
}
from "react";
import { ThemeContext } from "./theme-context";

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

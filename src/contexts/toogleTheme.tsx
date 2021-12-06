import { createContext} from "react";

interface Data {
  toggleTheme(): void;
  isDarkMode: boolean;
};

const ToggleThemeContext = createContext<Data>({} as Data);

export default ToggleThemeContext;
import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const styles = {
  global: (props) => ({
    body: {
      bg: mode("gray.100", "#000")(props),
      color: mode("gray.800", "whiteAlpha.900")(props),
    }
  })
}
{/* props의 의미, global의 역할, mode의 역할, styles 내에 body는 어디까지 적용?
  bg, color 차이, gray.100, gray.800, #000, whiteAlpha 색깔 차이는?
  extendTheme의 역할. mode("light 모드 일때 컬러", "dark 모드 일때 컬러"
  Button 색도 바뀌는 이유와 안 바뀌게하려면? */}

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
}

const theme = extendTheme({ config, styles });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);

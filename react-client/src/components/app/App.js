import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navbar, AppRoutes, StickyFooter } from "../";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export const primaryColors = {
  0: "#4516BA",
  1: "#0D6056",
  2: "#FE00FF",
  3: "#6D029D",
  4: "#F17803",
  5: "#85314C",
  6: "#B1A8C5",
  7: "#B1A8F5",
  8: "#EED000",
  9: "#A000B0",
 10: "#554EF5",
 11: "#B153FF"
};

const SecondaryColors = {
  0: "#C33D3A",
  1: "#D9F024",
  2: "#D8FE5B",
  3: "#FF1DFA",
  4: "#83B022",
  5: "#8BFFFE",
  6: "#FFFEDF",
  7: "#FFFEDF",
  8: "#000000",
  9: "#D8FE5B",
 10: "#8BFFFE",
 11: "#000000"
};

function getCustomTheme(index) {
  index = Number(index);
  if (!primaryColors[index]) return undefined;
  return createTheme({
    palette: {
      primary: {
        main: primaryColors[index],
      },
      secondary: {
        main: SecondaryColors[index],
      },
    },
  });
}

const App = ({ theme }) => {
  const [liveTheme, setLiveTheme] = useState(theme);
  const globalGraphicsFn = useSelector((state) => state.auth.globalGraphicsFn);

  useEffect(() => {
    if (globalGraphicsFn !== null) {
      const customTheme = getCustomTheme(globalGraphicsFn);
      if (customTheme) {
        setLiveTheme(customTheme);
      } else {
        setLiveTheme(theme);
      }
    }
  }, [theme, globalGraphicsFn]);
  return (
    <div>
      <ThemeProvider theme={liveTheme}>
        <Navbar />
        <AppRoutes />
        <StickyFooter />
      </ThemeProvider>
    </div>
  );
};

export default App;

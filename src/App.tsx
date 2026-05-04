import { MantineProvider } from "@mantine/core";
import { Router } from "./router/router";

function App() {
  return (
    <MantineProvider defaultColorScheme="dark">
      <Router />
    </MantineProvider>
  );
}

export default App;
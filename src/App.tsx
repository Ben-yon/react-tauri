import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import {
  AppShell,
  Navbar,
  Header,
  Text,
  MediaQuery,
  Burger,
  ActionIcon,
  Group,
} from "@mantine/core";
import { MantineProvider } from "@mantine/core";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { createStyles, useMantineTheme } from "@mantine/styles";
import "./App.css";
import Home from "./components/Home";
import Settings from "./components/Settings";

import { MemoryRouter, NavLink, Route, Routes } from "react-router-dom";

function App() {
  const views = [
    {
      path: "/",
      name: "Home",
      exact: true, //optional
      component: Home,
    },
    {
      path: "settings",
      name: "Settings",
      component: Settings,
    },
  ];
  const [opened, setOpened] = useState(false);
  const defaultColorScheme = "dark";
  const [colorScheme, setColorScheme] = useState(defaultColorScheme);
  const [greetMsg, setGreetMsg] = useState("defa ult");
  const [name, setName] = useState("");

  const toggleColorScheme = (value: string) => {
    const newValue = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(newValue);
  };

  const useStyles = createStyles((theme) => ({
    navLink: {
      display: "block",
      width: "100%",
      padding: theme.spacing.xs,
      borderRadius: theme.radius.md,
      color: colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      textDecoration: "none",

      "&:hover": {
        backgroundColor:
          colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[1],
      },
    },
    navLinkActive: {
      backgroundColor:
        colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[1],
    },
  }));

  const { classes } = useStyles();

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <MantineProvider
      theme={{ colorScheme: "dark", fontFamily: "Open Sans, sans serif" }}
      withGlobalStyles
    >
      <MemoryRouter>
        <AppShell
          padding="md"
          navbarOffsetBreakpoint="sm"
          fixed
          navbar={
            <Navbar width={{ sm: 200 }} hidden={!opened} hiddenBreakpoint="sm">
              {views.map((view, index) => (
                <NavLink
                  to={view.path}
                  key={index}
                  onClick={() => setOpened(false)}
                  className={({ isActive }) =>
                    classes.navLink +
                    " " +
                    (isActive ? classes.navLinkActive : "")
                  }
                >
                  <Group>
                    <Text>{view.name}</Text>
                  </Group>
                </NavLink>
              ))}
            </Navbar>
          }
          header={
            <Header height={70} padding="md ">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                  <Burger
                    opened={opened}
                    onClick={() => setOpened((o) => !o)}
                    size="sm"
                    color={useMantineTheme().colors.gray[6]}
                    mr="xl"
                  />
                </MediaQuery>
                <Text>R2=T2: Modern T2 Tax Filling</Text>
                <div style={{ marginLeft: "auto"}}>
                  <ActionIcon variant="default" onClick={()=> toggleColorScheme('')} size={30}>
                    {colorScheme === 'dark'? <SunIcon/> : <MoonIcon/>}
                  </ActionIcon>
                </div>
              </div>
            </Header>
          }
          styles={theme => ({
            main: {backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]}
          })}
        >
          <Routes>
            {
              views.map((view, index)=> <Route key={index} exact={view.exact} path={view.path} element={<view.component />}/>)
            }
          </Routes>
        </AppShell>
      </MemoryRouter>
    </MantineProvider>
  );
}

export default App;

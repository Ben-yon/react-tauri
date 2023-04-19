import { Component, useEffect, useState , } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import { useTranslation } from "react-i18next";
import { defaultLng, translations } from './i18n';
import {
  AppShell,
  Navbar,
  Header,
  Text,
  MediaQuery,
  Burger,
  ActionIcon,
  Group,
  Anchor,
} from "@mantine/core";
import { MantineProvider } from "@mantine/core";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { createStyles, useMantineTheme } from "@mantine/styles";
import "./App.css";
import Home from "./components/Home";
import Settings from "./components/Settings";
import ExampleView from "./components/ExampleView";

import { MemoryRouter, NavLink, Route, Routes } from "react-router-dom";
import localforage, { getItem } from "localforage";

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
    {
      path: 'example-view',
      name: 'Example-View',
      component: ExampleView
    }
  ];


  const { t, i18n } = useTranslation()
  const [opened, setOpened] = useState(false);
  const defaultColorScheme = "dark";
  const [colorScheme, setColorScheme] = useState(defaultColorScheme);
  // const [name, setName] = useState("");

  const [ lang, setLang ] = useState(i18n.resolvedLanguage);
  const [mobileNavOpened, setMobileNavOpened] = useState(false);
  const toggleColorScheme = (value: string) => {
    const newValue = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(newValue);
    localforage.setItem('colorScheme', newValue);
  };
  function getItems(key: string, stateSetter, defaultValue: string){
    localforage.getItem(key).then(value => stateSetter(value)).catch(_ => {
      stateSetter(defaultValue);
      localforage.setItem(key, defaultValue)
    })
  }

  useEffect(()=> {
    getItem('colorScheme', setColorScheme, defaultColorScheme),
    getItem('lang', setLang, defaultLng)
  }, []);

  useEffect(() => {
    localforage.setItem(lang, lang);
    i18n.changeLanguage(lang);
  }, [lang]);

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
    headerWrapper: {
      display: 'flex',
      alignItems: 'center'
    },
    headerRightItems: {
      marginLeft: 'auto'
    }
  }));

  const { classes } = useStyles();

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  function getLanguageHeaders(){
    return Object.keys(translations).map((supportedLang, index) =>
      <>
      {
        lang === supportedLang ?
        <Text>{supportedLang.toUpperCase()}</Text>:
        <Anchor onClick={() => setLang(supportedLang)}>{supportedLang.toUpperCase()}</Anchor>
      }
      <Text>{index < Object.keys(translations).length - 1 && '|'}</Text>
      </>
    )
  }
  return (
    <MantineProvider
      theme={{ colorScheme: colorScheme, fontFamily: "Open Sans, sans serif" }}
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
                className={classes.headerWrapper}
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
                <Group className={classes.headerRightItems}>
                  {getLanguageHeaders()}
                  <ActionIcon variant="default" onClick={()=> toggleColorScheme()} size={30}>
                    {colorScheme === 'dark'? <SunIcon/> : <MoonIcon/>}
                  </ActionIcon>
                </Group>
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

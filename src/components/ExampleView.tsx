import { Text, Anchor, Space, Button } from "@mantine/core";
import { useTranslation } from "react-i18next";
import {writeTextFile, BaseDirectory } from '@tauri-apps/api/fs'


import { downloadDir } from '@tauri-apps/api/path';
import { open } from '@tauri-apps/api/shell'


export default function ExampleView(){
  const { t } = useTranslation();



  async function createFile(){
    const downloadDirPath = await downloadDir();
    await writeTextFile('somefile.txt', 'This is my first tauri app and will be expert in it soon\n', {dir: BaseDirectory.Download})
    await open(downloadDirPath);
  }


  return (
    <>
      <Text>{ t('Modern Desktop Application Example') } </Text>
      <Space h={'md'}></Space>
      <Button onClick={createFile}>Let do this</Button>
    </>
  )
}

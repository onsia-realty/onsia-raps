import path from 'path';
import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import Store from 'electron-store';

const isProd = process.env.NODE_ENV === 'production';

// 설정 저장소 초기화
const store = new Store();

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

// 기존 IPC 핸들러
ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`);
});

// API 키 저장/로드
ipcMain.handle('get-api-key', async () => {
  return store.get('apiKey', '');
});

ipcMain.handle('set-api-key', async (_, apiKey: string) => {
  store.set('apiKey', apiKey);
  return true;
});

// 공공데이터 API 호출 (프로덕션 빌드용)
ipcMain.handle('fetch-public-api', async (_, { url, params }) => {
  try {
    const apiKey = store.get('apiKey', '') as string;
    if (!apiKey) {
      return { success: false, error: 'API 키가 설정되지 않았습니다.' };
    }

    const queryParams = new URLSearchParams({
      serviceKey: apiKey,
      ...params,
    });

    const response = await fetch(`${url}?${queryParams.toString()}`);
    const data = await response.text();

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'API 호출 실패',
    };
  }
});

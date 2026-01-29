import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

const handler = {
  send(channel: string, value: unknown) {
    ipcRenderer.send(channel, value);
  },
  on(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
  // IPC invoke 핸들러 추가 (양방향 통신)
  invoke(channel: string, ...args: unknown[]) {
    return ipcRenderer.invoke(channel, ...args);
  },
};

contextBridge.exposeInMainWorld('ipc', handler);

export type IpcHandler = typeof handler;

import { MessageListener } from "./types";

export async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);

  return tab;
}

export const createPort = (name: string) => {
  return chrome.runtime.connect({ name });
};

export const getStorageItem = async (key: string) => {
  return await chrome.storage.local.get([key]);
};

export const attachDebugger = (tabId: number) => {
  chrome.debugger.attach({ tabId }, "1.3", () => {
    chrome.debugger.sendCommand(
      { tabId },
      "Network.enable",
      {},
      () => chrome.runtime.lastError && console.error(chrome.runtime.lastError),
    );
  });
};

export const detachDebugger = (tabId: number) => {
  chrome.debugger.detach({ tabId });
};

export const sendMessage = async <T>(message: T) => {
  const response = await chrome.runtime.sendMessage(message);

  return response;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addMessageListener = <M = any, R = any>(
  listener: MessageListener<M, R>,
) => {
  chrome.runtime.onMessage.addListener(listener);
};

export const addDebuggerListener = (
  listener: (
    debuggee: chrome.debugger.Debuggee,
    method: string,
    params?: object,
  ) => void,
) => {
  chrome.debugger.onEvent.addListener(listener);
};

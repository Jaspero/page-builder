import { writable } from 'svelte/store';

export const contextMenu = writable<{
  event: MouseEvent;
  items: Array<{
    label: string;
    color?: string;
    callback: () => void;
  }>;
} | null>(null);

export const iframeEl = writable<HTMLIFrameElement | null>(null);

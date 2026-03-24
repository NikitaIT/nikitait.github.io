import { JSDOM } from "jsdom";

export function wind(): Document {
  const window = new JSDOM(`<html><head></head><body></body></html>`, {
    pretendToBeVisual: true,
  }).window;
  return window.document;
}

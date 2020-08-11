import { browser } from "webextension-polyfill-ts";

const s = document.createElement("script");
// TODO: add "script.js" to web_accessible_resources in manifest.json
s.src = browser.runtime.getURL("rnnoise/rnnoise-runtime.js");
(document.head || document.documentElement).appendChild(s);

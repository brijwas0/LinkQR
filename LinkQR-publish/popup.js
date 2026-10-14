"use strict";

// LinkQR — creator branding is intentionally fixed as Tushar Code.
const urlInput = document.getElementById("url");
const generateButton = document.getElementById("generate");
const downloadButton = document.getElementById("download");
const copyButton = document.getElementById("copy");
const qrContainer = document.getElementById("qr-container");
const emptyState = document.getElementById("empty-state");
const statusEl = document.getElementById("status");

let qrMatrix = null;
let currentUrl = "";

function setStatus(text, error = false) {
  statusEl.textContent = text;
  statusEl.style.color = error ? "#b42318" : "#667085";
}

function isSupportedUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function clearQr() {
  qrMatrix = null;
  currentUrl = "";
  qrContainer.querySelectorAll("canvas").forEach((el) => el.remove());
  emptyState.hidden = false;
  downloadButton.disabled = true;
  copyButton.disabled = true;
}

function renderQr(value) {
  if (!isSupportedUrl(value)) {
    clearQr();
    setStatus("Enter a valid http:// or https:// URL.", true);
    return false;
  }

  try {
    // Type 0 = automatic QR version. Error correction M is a good balance.
    const qr = new QRCodeEngine(0, QRErrorCorrectLevel.M);
    qr.addData(value);
    qr.make();

    const modules = qr.getModuleCount();
    const scale = Math.max(4, Math.floor(232 / modules));
    const quiet = 4;
    const size = (modules + quiet * 2) * scale;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });

    canvas.width = size;
    canvas.height = size;
    canvas.setAttribute("aria-label", "Generated QR code");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#000000";

    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        if (qr.isDark(row, col)) {
          ctx.fillRect((col + quiet) * scale, (row + quiet) * scale, scale, scale);
        }
      }
    }

    qrContainer.querySelectorAll("canvas").forEach((el) => el.remove());
    emptyState.hidden = true;
    qrContainer.appendChild(canvas);

    qrMatrix = canvas;
    currentUrl = value;
    downloadButton.disabled = false;
    copyButton.disabled = false;
    setStatus("QR generated locally ✓");
    return true;
  } catch (error) {
    clearQr();
    setStatus("This URL is too long or could not be encoded.", true);
    return false;
  }
}

function generateFromInput() {
  renderQr(urlInput.value.trim());
}

generateButton.addEventListener("click", generateFromInput);
urlInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") generateFromInput();
});

downloadButton.addEventListener("click", () => {
  if (!qrMatrix) return;
  const link = document.createElement("a");
  link.download = "LinkQR.png";
  link.href = qrMatrix.toDataURL("image/png");
  link.click();
  setStatus("PNG downloaded ✓");
});

copyButton.addEventListener("click", async () => {
  if (!qrMatrix) return;
  if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
    setStatus("Image copy is not supported by this browser.", true);
    return;
  }

  try {
    const blob = await new Promise((resolve) => qrMatrix.toBlob(resolve, "image/png"));
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    setStatus("QR copied to clipboard ✓");
  } catch {
    setStatus("Could not copy the QR image. Try Download PNG.", true);
  }
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs && tabs[0];
  const url = tab && tab.url ? tab.url : "";

  if (!url) {
    clearQr();
    setStatus("Could not read the current tab URL.", true);
    return;
  }

  if (!isSupportedUrl(url)) {
    clearQr();
    setStatus("This browser page cannot be converted to a QR code.", true);
    return;
  }

  urlInput.value = url;
  renderQr(url);
});

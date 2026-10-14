# LinkQR

Chrome/Edge Manifest V3 extension that generates QR codes locally from the current tab URL.

Creator branding: **Tushar Code** (fixed in the project UI and manifest).

## Features
- Current active tab URL detection
- Real, standards-compliant QR generation using a bundled QR engine
- Manual URL editing
- Download QR as PNG
- Copy QR image to clipboard
- No backend, API, CDN, analytics, or tracking
- Only the `activeTab` permission

## Install in Chrome
1. Extract the ZIP.
2. Open `chrome://extensions/`.
3. Enable Developer mode.
4. Click Load unpacked.
5. Select the extracted `LinkQR` folder.

## Install in Edge
1. Extract the ZIP.
2. Open `edge://extensions/`.
3. Enable Developer mode.
4. Click Load unpacked.
5. Select the extracted `LinkQR` folder.

## License note
The bundled QR engine is based on the MIT-licensed QRCode JavaScript implementation by Kazuhiko Arase and is included locally so the extension has no runtime CDN dependency.

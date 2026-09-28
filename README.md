# Serialist

A phone app for writing a web novel, with **Plotfeed**, a plotting board where you play your main character and plan what happens next.

- It's an installable web app (a PWA). You add it to your home screen from the browser, with no Play Store needed. It works on Android and iPhone, and it runs offline.
- It has no AI and no accounts. Everything is saved on the device you use it on.

## What's in the folder

| File | What it is |
| --- | --- |
| `index.html` | The page shell: head tags, the empty views, and the script tag. |
| `styles.css` | All the styling. Colours are the tokens at the top, light first, then dark. |
| `app.js` | All the app logic (see the map below). |
| `manifest.webmanifest` | The app's name, icon and colours, used when it's installed. |
| `sw.js` | The offline worker. It keeps a copy of the app files on the phone. |
| `icons/` | App icons for Android, iPhone and the browser tab. |
| `fonts/` | Figtree and Literata, bundled so the app looks right offline. |

## Work on it in VS Code

1. Open this folder in VS Code (**File → Open Folder…**).
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` and choose **Open with Live Server**. The app opens in your browser at `http://127.0.0.1:5500`.
4. Edit a file and save. The page reloads with your change.

While you run it on `localhost`, the offline worker stays off, so you always see your latest code. To test offline mode on your laptop, open `http://127.0.0.1:5500/?sw=1`.

To see the phone layout on your laptop, press **F12** in Chrome and turn on the device toolbar (**Ctrl+Shift+M**).

> The novels you write while testing on your laptop are saved in your laptop's browser. They don't appear on your phone. Use **Backup** to move them across (see below).

## Put it online (free) so your phone can install it

A phone can only install the app from an `https://` address. GitHub Pages hosts it for free:

1. Create a free account at github.com, then create a new repository, for example `serialist-app`.
2. Upload every file and folder from this folder into the repository. You can drag them onto the repository page in the browser, or use VS Code's **Source Control** panel.
3. In the repository, go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, then pick `main` and `/ (root)`, and save.
4. After a minute or two the app is live at `https://YOUR-USERNAME.github.io/serialist-app/`.

Anyone who has that link can open the app, but each person's novels stay on their own device. Nobody can see yours.

(Another option: drag this folder onto **app.netlify.com/drop** for an instant address.)

## Install it on your phone

- **Android (Chrome):** open the address, then tap **⋮ → Install app** (or **Add to Home screen**). The app also shows an **Install** card on its home screen when the phone allows it.
- **iPhone (Safari):** open the address, then tap **Share → Add to Home Screen**.

After that, open Serialist from its icon. It works without internet.

## Your data and backups

- Everything is saved on the device in the browser's storage (IndexedDB). The app asks the browser to keep that storage safe from automatic cleanup.
- **Uninstalling the app or clearing the browser's data deletes your novels.** Back up regularly.
- In the app, tap the **sliders button** (top right of the shelf), then **Save a backup file**. On a phone, the file goes to Downloads. Copy it to Google Drive or send it to yourself.
- **Restore from a backup file** replaces everything in the app with the backup. You can also use it to move your novels between your laptop and your phone.

## Publish an update

1. Change the files and test them with Live Server.
2. In `sw.js`, raise the version: `serialist-v1` → `serialist-v2`. **Do this every time**, or phones keep the old copy.
3. Also bump `APP_VERSION` near the top of `app.js`, so the version shown in Settings changes too.
4. Upload the changed files to GitHub again.
5. The next time the app opens on the phone, it shows **"A new version of Serialist is ready"**. Tap **Update**.

## Map of app.js

| Section (search for it) | What it does |
| --- | --- |
| `Helpers` | Small utilities: word count, dates, escaping text, icons. |
| `Plotfeed helpers and starter worlds` | Relationship labels, avatar colours, and the four ready-made worlds. |
| `State` | Everything the app holds in memory (`S`). |
| `Example novels` | The two example novels shown on first launch. |
| `Storage` | Saving to IndexedDB, with a localStorage fallback. |
| `Rendering` | The shelf, novel page, chapter list, story bible and editor. |
| `Forms` | New novel, novel details, characters, world notes, word goal. |
| `Plotfeed: the plotting board` | The feed, reactions, tension, threads and chapter outlines. |
| `Settings, backup and restore` | Backup files, restore, and the install card. |
| `Actions` | Every button's `data-act` name and what it runs. |
| `Boot` | Opening storage, the first-run examples, and the offline worker. |

To add a button: give it `data-act="my-action"` in the HTML, then add `'my-action': (el) => { ... }` to the `A` object in the **Actions** section.

## Adding Gemini later

Your Google AI Plus subscription covers Google's own apps, not this one. Gemini inside your own app uses the **Gemini API**, which is billed separately. You create an API key in Google AI Studio, where you can also see the current pricing and free limits.

- **Just for you:** add a field in Settings where you paste your key. It's saved on your phone only. Then call the Gemini API from `app.js`, for example to suggest the cast's reactions in Plotfeed, or to draft a chapter from its outline.
- **For other people too:** don't put a key inside the app, because anyone could copy it. Put a small server between the app and Gemini instead.

## Later: an Android APK file

The same code can be wrapped as an APK with **Capacitor** (capacitorjs.com) and Android Studio, then installed directly without the Play Store. That's only needed if you want it to behave more like a native app than an installed web app already does.

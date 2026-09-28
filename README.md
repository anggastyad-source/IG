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
| `Storage` | Saving to IndexedDB, with a localStorage fallback. Every save stamps `modAt` for sync. |
| `Rendering` | The shelf, novel page, chapter list, story bible and editor. |
| `Forms` | New novel, novel details, characters, world notes, word goal. |
| `Plotfeed: the plotting board` | The feed, reactions, tension, threads and chapter outlines. |
| `Gemini: the AI partner` | Your Gemini key, the Plotfeed partner and scene, and the editor's draft, polish and summary helpers. |
| `Drive sync` | Google sign-in, the Drive copy, and merging changes from your other devices. |
| `Settings, backup and restore` | Backup files, restore, and the install card. |
| `Actions` | Every button's `data-act` name and what it runs. |
| `Boot` | Opening storage, the first-run examples, and the offline worker. |

To add a button: give it `data-act="my-action"` in the HTML, then add `'my-action': (el) => { ... }` to the `A` object in the **Actions** section.

## Sync between your phone and laptop (Google Drive)

Serialist can keep your novels the same on every device. It keeps a copy in a hidden app folder in your own Google Drive. The folder doesn't appear in Drive, and Serialist can't see anything else there.

**One-time setup in Google Cloud** (about 10 minutes, free):

1. Open **console.cloud.google.com** and create a project, for example `Serialist`.
2. Go to **APIs & Services → Library**, search for **Google Drive API**, and click **Enable**.
3. Go to **Google Auth Platform** (called **OAuth consent screen** in older menus) and click **Get started**:
   - App name: `Serialist`. Use your email for support and contact.
   - Audience: **External**.
   - Under **Audience → Test users**, add your own Gmail address.
   - Under **Data access → Add or remove scopes**, add `https://www.googleapis.com/auth/drive.appdata`.
4. Go to **Clients → Create client** and choose **Web application**. Under **Authorised JavaScript origins**, add:
   - `https://anggastyad-source.github.io`
   - `http://127.0.0.1:5500` (for testing with Live Server)
5. Click **Create**, then copy the **Client ID**. It ends in `.apps.googleusercontent.com`.

**On each device:**

1. Tap the sliders button, then under **Sync with Google Drive** paste the client ID and tap **Save client ID**.
2. Tap **Connect Google Drive** and sign in with the same Google account on every device.
3. If Google says it hasn't verified the app, tap **Continue**. It's your own app.

**How it works:**

- **When it syncs:** when the app opens, about 20 seconds after you stop making changes, when you switch away from the app, and when you tap **Sync now**.
- **The top bar** shows **Synced** when both copies match.
- **Tap to sync:** Google's sign-in lasts about an hour. After that the top bar shows **Tap to sync**, and one tap signs you in again.
- **Same chapter changed on two devices:** if you changed the same chapter on both before syncing, you keep both versions. The second one is titled "(from other device)". Nothing is overwritten.
- **Deletions** reach the other device.
- **Example novels** stay on each device and aren't synced.
- **Backup files still work,** and they're still a good extra safety net.

## The AI partner (Gemini)

Plotfeed can act as your writing partner. You play the main character. After you post, the other characters reply in their own voices, based on everything in the feed so far. A **Co-author** card then suggests relationship and tension changes, twists, scene changes, new threads and options for your next move. Nothing is applied until you tap it.

**Set it up once on each device:**

1. Go to **aistudio.google.com**, sign in, and create an API key. Your Google AI Plus subscription doesn't cover this. The API has its own free tier and limits, which you can check in AI Studio.
2. In Serialist, tap the **sliders button**, paste the key under **AI partner · Gemini**, and tap **Save and test key**.

The key is saved only on that device. It's never put in backup files. Whatever you send to the partner goes to Google.

**Using it:**

- **Scene** (at the top of Plotfeed) sets where you are and who's there.
  - Only characters in the scene reply on their own.
  - Anyone you speak to by name, for example "so Cass, what do you think?", replies first, even if they aren't in the scene.
- On any reply, **✎** edits it and **×** removes it. **Redo replies** asks again. **Cast replies** asks for replies to an older post.
- The **⋯** menu in Plotfeed turns the partner on or off and sets how many characters reply each turn.
- In the chapter editor, the outline sheet has **Draft this chapter with Gemini**. The chapter menu has **Polish selected text** and **Write it with Gemini** for the summary. Text Gemini writes doesn't count toward your daily word goal.

In `app.js`, search for `Gemini: the AI partner`.

## Later: an Android APK file

The same code can be wrapped as an APK with **Capacitor** (capacitorjs.com) and Android Studio, then installed directly without the Play Store. That's only needed if you want it to behave more like a native app than an installed web app already does.

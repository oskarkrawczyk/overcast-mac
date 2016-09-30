# Overcast for Mac (unofficial)

Unofficial Overcast for Mac is simply the Overcast website wrapped within
Electron.app, restyled so it feels a bit more native to the desktop.

Some interface elements are disabled on purpose because they serve little
purpose for me, mostly because I use Overcast for iOS for most management and listening, and prefer the mac app to be a nice looking read-only (for now).

![](https://cloud.githubusercontent.com/assets/34213/18970143/64c909d8-8690-11e6-8b06-8e5ad37feb11.png)

### Potential Issues

Since it's just a restyled websites, it's prone to potential issues if Marco
updates some part of the interface – although should be relatively easy to fix.

### Planned changes

- [ ] **Build the initial macOS package**
- [x] Dock and menubar icons
- [ ] Dark theme
- [ ] Bring back the ability to search for podcasts
- [ ] Bring back speed control
- [ ] Ability to toggle description visibility on channel screen
- [ ] Better styles on login screen (+ Overcast branding)
- [ ] Desktop badge for unplayed episodes
- [ ] Desktop notification when a new episode is found
- [x] Fully restyled interface

### Disabled interface

- Search
- Header
- Footer
- License info
- Delete podcast
- Save in Overcast
- Speed control
- Date and episode description on player screen
- Episodes description on channel screen
- ...

### Running the developer version

- Clone repo
- `npm install` & `npm start`

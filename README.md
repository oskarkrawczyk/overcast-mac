# Overcast for Mac (unofficial)

Unofficial Overcast for Mac is simply the Overcast website wrapped within
**Electron**, restyled so it feels a bit more native to the desktop.

Some interface elements are disabled on purpose because they serve little
purpose to me, mostly because I use Overcast for iOS for most management and listening, and prefer the mac app to be a nice looking read-only (for now).

### **[Download for Mac](https://github.com/oskarkrawczyk/overcast-mac/releases)**

<img width="1036" alt="" src="https://cloud.githubusercontent.com/assets/34213/18993766/17eb58b0-8725-11e6-8a52-a631e7c57e7b.png">

### Potential Issues

Since it's just a restyled website, it's prone to potential issues if [Marco](https://twitter.com/marcoarment)
updates some part of the interface – although should be relatively easy to fix.

### Plans

- [x] **Build the initial macOS package**
- [x] Dock and menubar icons
- [ ] Dark theme
- [ ] Bring back the ability to search for podcasts
- [ ] Bring back speed control
- [ ] Ability to toggle description visibility on channel screen
- [ ] Better styles on login screen (+ Overcast branding)
- [x] Dock badge for active episodes
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

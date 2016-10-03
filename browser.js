const electron = require("electron")
const ipc      = electron.ipcRenderer
const storage  = electron.remote.require("./storage")

// const NativeNotification = Notification

// Notification = (title, options) => {
//   const notification = new NativeNotification(title, options)
//   notification.addEventListener('click', () => {
//     ipc.send('notification-click')
//   })
//
//   return notification
// }

createElements = (htmlStr) => {
  var frag = document.createDocumentFragment(),
    temp = document.createElement("div");
  temp.innerHTML = htmlStr

  while (temp.firstChild){
    frag.appendChild(temp.firstChild)
  }
  return frag
}

document.addEventListener("DOMContentLoaded", (event) => {
  var player      = document.querySelector("audio");
  var coverart    = document.querySelector(".fullart_container .art")
  var episodecell = document.querySelectorAll(".episodecell")
  var count       = episodecell.length > 0 ? episodecell.length : storage.get("active-episodes")

  var icons = {
    back:    "<svg viewBox='0 0 16 16'><path class='path1' d='M9 2.5v5l5-5v11l-5-5v5l-5.5-5.5z'></path></svg>",
    play:    "<svg viewBox='0 0 16 16'><path class='path1' d='M3 2l10 6-10 6z'></path></svg>",
    forward: "<svg viewBox='0 0 16 16'><path class='path1' d='M8 13.5v-5l-5 5v-11l5 5v-5l5.5 5.5z'></path></svg>"
  }

  var template = {
    tabs: "<ul class='mainListTabs'><li><a class='active' href='#episodecell'>All active episodes</a></li><li><a href='#feedcell'>Your podcasts</a></li></ul>"
  }

  // we're on listing
  if (document.location.href.indexOf("/podcasts") >= 0){
    document.body.appendChild(createElements(template.tabs))
    document.body.classList.add("page_podcasts")

    var tabs = document.querySelectorAll(".mainListTabs a")

    var showElements = (selector) => {
      var conts = document.querySelectorAll("." + selector)
      for (var iii = 0; iii < conts.length; ++iii){
        conts[iii].classList.add("visible")
      }
    }

    for (var i = 0; i < tabs.length; ++i){
      tabs[i].addEventListener("click", (event) => {
        event.preventDefault()
        event.stopPropagation()

        tabs[0].classList.remove("active")
        tabs[1].classList.remove("active")
        event.toElement.classList.add("active")

        // hide all episodes and podcasts
        var allcells = document.querySelectorAll(".episodecell, .feedcell")
        for (var ii = 0; ii < allcells.length; ++ii){
          allcells[ii].classList.remove("visible")
        }

        // only show episodes or podcast, depending on the tab active
        showElements(event.toElement.href.split("#")[1])
      })
    }

    showElements("episodecell")

    // store the active episodes count for other screens that have
    // no access to that info
    storage.set("active-episodes", count);
  }

  // update dock badge on each screen
  ipc.send("update-badge", {
    count: count
  })

  if (coverart){
    
    // inject shadow art
    var shadowart       = document.createElement("img")
    shadowart.src       = coverart.src
    shadowart.className = "shadowart"
    coverart.parentNode.appendChild(shadowart)

    // inject background art
    var backgroundart                   = document.createElement("div")
    backgroundart.style.backgroundImage = "url(" + coverart.src + ")"
    backgroundart.className             = "backgroundart"
    coverart.parentNode.appendChild(backgroundart)
  }

  if (player){
    var seekbackbutton    = document.querySelector("#seekbackbutton")
    var seekforwardbutton = document.querySelector("#seekforwardbutton")

    seekbackbutton.innerHTML    = icons.back
    seekforwardbutton.innerHTML = icons.forward

    player.addEventListener("play", () => {
      coverart.classList.add("playing")
      shadowart.classList.add("playing")
    })

    player.addEventListener("pause", () => {
      coverart.classList.remove("playing")
      shadowart.classList.remove("playing")
    })
  }

})

// Notification.prototype = NativeNotification.prototype
// Notification.permission = NativeNotification.permission
// Notification.requestPermission = NativeNotification.requestPermission.bind(Notification)

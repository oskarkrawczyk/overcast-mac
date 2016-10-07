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
//
// Notification.prototype = NativeNotification.prototype
// Notification.permission = NativeNotification.permission
// Notification.requestPermission = NativeNotification.requestPermission.bind(Notification)

class Overcast {
  constructor(options){
    this.elements = {}
    this.templates = {}

    this.elements.player      = document.querySelector("audio")
    this.elements.coverart    = document.querySelector(".fullart_container .art")
    this.elements.episodecell = document.querySelectorAll(".episodecell")
    this.elements.styles      = document.querySelectorAll("link[rel='stylesheet']")
    this.elements.count       = this.elements.episodecell.length > 0 ? this.elements.episodecell.length : storage.get("active-episodes")

    this.templates = {
      tabs:    "<ul class='mainListTabs'><li><a class='active' href='#episodecell'>All active episodes</a></li><li><a href='#feedcell'>Your podcasts</a></li></ul>",
      back:    "<svg viewBox='0 0 16 16'><path class='path1' d='M9 2.5v5l5-5v11l-5-5v5l-5.5-5.5z'></path></svg>",
      play:    "<svg viewBox='0 0 16 16'><path class='path1' d='M3 2l10 6-10 6z'></path></svg>",
      forward: "<svg viewBox='0 0 16 16'><path class='path1' d='M8 13.5v-5l-5 5v-11l5 5v-5l5.5 5.5z'></path></svg>"
    }

    // this.removeStylesheets(this.elements.styles)

    // we're on listing
    if (document.location.href.indexOf("/podcasts") >= 0){
      this.podcastsList()
    }

    // update dock badge on each screen
    ipc.send("update-badge", {
      count: this.elements.count
    })

    this.player()
  }

  createElements(htmlStr){
    let frag = document.createDocumentFragment(),
      temp = document.createElement("div")
    temp.innerHTML = htmlStr

    while (temp.firstChild){
      frag.appendChild(temp.firstChild)
    }
    return frag
  }

  removeStylesheets(styles){
    let i
    for (i = 0; i < styles.length; ++i){
      let element = styles[i]
      element.parentNode.removeChild(element)
    }
  }

  player(){
    if (this.elements.coverart){
      this.addCoverart()
    }

    if (this.elements.player){
      this.replacePlayerButtons()
    }
  }

  replacePlayerButtons(){
    let seekbackbutton    = document.querySelector("#seekbackbutton")
    let seekforwardbutton = document.querySelector("#seekforwardbutton")

    seekbackbutton.innerHTML    = this.templates.back
    seekforwardbutton.innerHTML = this.templates.forward

    this.elements.player.addEventListener("play", () => {
      this.elements.coverart.classList.add("playing")
      this.elements.shadowart.classList.add("playing")
    })

    this.elements.player.addEventListener("pause", () => {
      this.elements.coverart.classList.remove("playing")
      this.elements.shadowart.classList.remove("playing")
    })
  }

  addCoverart(){

    // inject shadow art
    this.elements.shadowart           = document.createElement("img")
    this.elements.shadowart.src       = this.elements.coverart.src
    this.elements.shadowart.className = "shadowart"
    this.elements.coverart.parentNode.appendChild(this.elements.shadowart)

    // inject background art
    let backgroundart                   = document.createElement("div")
    backgroundart.style.backgroundImage = `url(${this.elements.coverart.src})`
    backgroundart.className             = "backgroundart"
    this.elements.coverart.parentNode.appendChild(backgroundart)
  }

  podcastsList(){
    document.body.appendChild(this.createElements(this.templates.tabs))
    document.body.classList.add("page_podcasts")

    let tabs = document.querySelectorAll(".mainListTabs a")
    let i
    for (i = 0; i < tabs.length; ++i){
      tabs[i].addEventListener("click", (event) => {
        event.preventDefault()
        event.stopPropagation()

        tabs[0].classList.remove("active")
        tabs[1].classList.remove("active")
        event.toElement.classList.add("active")

        // hide all episodes and podcasts
        let allcells = document.querySelectorAll(".episodecell, .feedcell")
        let ii
        for (ii = 0; ii < allcells.length; ++ii){
          allcells[ii].classList.remove("visible")
        }

        // only show episodes or podcast, depending on the tab active
        this.showElements(event.toElement.href.split("#")[1])
      })
    }

    this.showElements("episodecell")

    // store the active episodes count for other screens that have
    // no access to that info
    storage.set("active-episodes", this.elements.count);
  }

  showElements(selector){
    let elements = document.querySelectorAll(`.${selector}`)
    let i

    for (i = 0; i < elements.length; ++i){
      elements[i].classList.add("visible")
    }
  }
}

document.addEventListener("DOMContentLoaded", (event) => new Overcast())

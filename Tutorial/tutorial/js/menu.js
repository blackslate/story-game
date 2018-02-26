"use strict"


;(function domLoaded(thimble){

  if (!thimble) {
    thimble = window.thimble = {}
  }

  
  class Navigation {
    constructor () {
      this.pageURL = this._getPageURL()
      this.article = document.querySelector("article")
      this.sections = [].slice.call(document.querySelectorAll("section"))
      this.check = document.querySelector("input#menu")
      this.nav = document.querySelector("header .nav")

      this.sectionIds = this.sections.map(function (section) {
        return section.id
      })

      this.sectionDefault = this.sections.length - 1
      this.sectionIndex = this._getSectionIndex()

      this.scrollMap = this._getScrollMap()

      if (this.nav) {        
        this.navButtons = this._getNavButtonMap()
        this.menuItems = this._getNavMenuItemMap()
        this._refreshView()
      }

      let treatClick = this.treatClick.bind(this)
      document.body.addEventListener("click", treatClick, false)
    }

    _getPageURL() {
      let urlArray = window.location.href.split("/")
      urlArray.pop()
      let pageURL = urlArray.join("/") + "/"

      return pageURL
    }


    _getSectionIndex() {
      let index = this.sectionDefault
      let hash = window.location.hash.substring(1)

      if (hash) {
        let temp = this.sectionIds.indexOf(hash) 
        if (temp < 0) {
        } else {
          index = temp
        }
      }

      return index
    }



    _getScrollMap() {
      let scrollMap // = localStorage.getItem("scrollMap")
      // try {
      //   scrollMap = JSON.parse(scrollMap)
      // } catch (error) {}

      if (typeof scrollMap !== "object") {
        scrollMap = {}
      }

      let total = this.sectionIds.length
      let ii
      , sectionId
      , scroll

      for (ii = 0; ii < total; ii += 1) {
        sectionId = this.sectionIds[ii]
        scroll = scrollMap[sectionId]
        if (typeof scroll !== "number") {
          scrollMap[sectionId] = 0
        }
      }

      return scrollMap
    }


    _getNavButtonMap() {
      let next = this.nav.querySelector("[href='#next']")
      let back = this.nav.querySelector("[href='#back']")
      this.nav.classList.add("active")

      return {
        back: back
        , next: next
      }
    }


    _getNavMenuItemMap() {
      let itemMap = {}
      let link
      let menuItems = document.querySelectorAll("nav li")
      menuItems = [].slice.call(menuItems)

      menuItems.forEach(function (menuItem) {
        let hash = menuItem.querySelector("a").href
        hash = hash.substring(hash.lastIndexOf("#") + 1)
        itemMap[hash] = menuItem
      })

      return itemMap
    }


    _treatLink(event, href) {
      if (!href.startsWith(this.pageURL)) {
        // Allow external links to escape
        return
      }

      let hash = href.substring(href.lastIndexOf("#") + 1)

      event.preventDefault() // don't update location.hash
      this._saveSectionScroll()

      switch (hash) {
        case "back":
          if (this.sectionIndex
              && this.sectionIndex !== this.sectionDefault) {
            // not on default section
            this.sectionIndex -= 1
          } else {
            // on default section or section 0
            this.sectionIndex = this.sectionDefault
          }
          break

          case "next":
          if (this.sectionIndex === this.sectionDefault) {
            // on default section
            this.sectionIndex = 0
          } else {
            this.sectionIndex = 
              Math.min(this.sectionDefault - 1, this.sectionIndex + 1)
          }
          break

          default:
          this.sectionIndex = this.sectionIds.indexOf(hash)  
                  }

      this._refreshView()

      setTimeout(() => {
        window.location.hash = "#" + this.sectionIds[this.sectionIndex]
      }, 1)
    }


    _saveSectionScroll() {
      let hash = this.sectionIds[this.sectionIndex]
      let scroll = this.article.scrollTop
      this.scrollMap[hash] = scroll
      // localStorage.setItem("scrollMap", JSON.stringify(scrollMap))
    }


    _refreshView() {
      this._showSection()
      this._setNavButtonStates()
      this._highlightMenuItem()
      this._setSectionScrollTop()
    }

    _showSection() {
      let hash = this.sectionIds[this.sectionIndex]

      let selectSection = (section) => {
        if (section.id === hash) {
          section.classList.add("active")
        } else {
          section.classList.remove("active")
        }
      }

      this.sections.forEach(selectSection)  
    }


    _setNavButtonStates() {
      this.navButtons.back.classList.remove("disabled")
      this.navButtons.next.classList.remove("disabled")

      if (this.sectionIndex === this.sectionDefault) {
        this.navButtons.back.classList.add("disabled")
      } else if (this.sectionIndex === this.sectionDefault - 1) {
        this.navButtons.next.classList.add("disabled")
      }
    }


    _highlightMenuItem() {
      let hash = this.sectionIds[this.sectionIndex]
      let key
      , menuItem

      for (key in this.menuItems) {
        menuItem = this.menuItems[key]
        if (key === hash) {
          menuItem.classList.add("target")
        } else {
          menuItem.classList.remove("target")
        }
      }
    }

    _setSectionScrollTop() {
      let hash = this.sectionIds[this.sectionIndex]
      let scroll = this.scrollMap[hash]

      setTimeout(() => {
        this.article.scrollTop = scroll
      }, 10)
    }


    // PUBLIC METHODS 

    treatClick(event) {
      let target = event.target
      let ignore = ["NAV"] // , "INPUT", "LABEL"]
      let href
      , index
      , hash

      while (target && ignore.indexOf(target.nodeName) < 0) {
        if (target.nodeName === "A") {
          this._treatLink(event, target.href)
          target = false
          break
        }

        target = target.parentNode
      }

      if (!target) {
        // The user tapped outside the input element. Close the menu.
        this.check.checked = false
      }
    }
  }

  thimble.navigation = new Navigation()

})(window.thimble)
"use strict"

;(function () {
  document.body.onmouseup = treatClick

  function treatClick(event) {
    document.body.classList.add("clicked")
  }
})()
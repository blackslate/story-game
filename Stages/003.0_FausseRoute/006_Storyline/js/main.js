;(function mainLoaded(){

  console.log("js/main.js loaded")

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', registerWorker)

    function registerWorker() {
      navigator.serviceWorker.register('service-worker.js')
                             .then(checkRegistration, treatError)
    }

    function checkRegistration(registration) {
      // Registration was successful
      console.log(
        'ServiceWorker registration successful with scope: '
      , registration.scope
      )
    }

    function treatError(error) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', error);
    }
  }

})()
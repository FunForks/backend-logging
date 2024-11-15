/**
 * script.js
 */

const form       = document.getElementById("form")
const pre        = document.getElementById("pre")
const private    = document.getElementById("private")
const prohibited = document.getElementById("prohibited")
const notFound   = document.getElementById("not-found")
const missing    = document.getElementById("missing")

form.addEventListener("submit", getCrypto)
private.addEventListener("click", trigger403)
notFound.addEventListener("click", triggerNotFound)

function getCrypto(event) {
  event.preventDefault()
  const url = `/crypto`
  console.log("url:", url);
  
  fetch(url)
   .then(treatResponse)
   .then(text => pre.innerHTML = text)
   .catch(error => treatError(pre, error))
}

function trigger403() {
  const url = `/private`
  console.log("url:", url);
  
  fetch(url)
   .then(treatResponse)
   .then(text => prohibited.innerHTML = text)
   .catch(error => treatError(prohibited, error))
}

function triggerNotFound() {
  const url = `/not-found`
  console.log("url:", url);
  
  fetch(url)
   .then(treatResponse)
   .then(text => missing.innerHTML = text)
   .catch(error => treatError(missing, error))
}

function treatResponse(response) {
  if (response.ok) {
    return response.text()

  } else {
    const { status, statusText } = response
    const error = `
error:  ${statusText}
status: ${status}`
    throw new Error(error)
  }
}

function treatError(element, error) {
  element.innerText = error.message
}
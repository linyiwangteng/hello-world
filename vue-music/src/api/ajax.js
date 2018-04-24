export function getJSON(url) {
  var promise = new Promise(function(resolve, reject) {
    var client = new XMLHttpRequest()
    client.open('GET', url, true)
    client.onreadystatechange = handle
    client.responseType = 'json'
    client.setRequestHeader('Accept', 'application/json')
    client.send()

    function handle() {
      if (this.readyState !== 4) {
        return
      }
      if (this.status === 200) {
        resolve(this.response)
      } else {
        reject(new Error(this.statusText))
      }
    }
  })
}
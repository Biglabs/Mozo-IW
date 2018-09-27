const host = window["mozoServerUrl"] || 'http://localhost:33013/'

async function _sendRequest(url, method, data = null) {
  const request = new Request(host + url);

  let result = null

  let options = {
    method: method,
    headers: new Headers({
      "Content-type": "application/json; charset=utf-8"
    })
  };

  if (data) {
    options["body"] = JSON.stringify(data)
  }

  await fetch(request, options)
    .then(async function (response) {
      await response.json().then(function (data) {
        result = data.result
      });
    })
    .catch(function (err) {
      result = err
    });

  return result
}

export async function post(url, data = null) {

  return await _sendRequest(url, "POST", data)

}

export async function get(url, data = null) {
  var query = ""

  if(data) {
    var esc = encodeURIComponent;
    query = Object.keys(data)
    .map(k => esc(k) + '=' + esc(data[k]))
    .join('&');
  }

  return await _sendRequest(query.trim() != "" ? (url + "?" + query) : url , "GET", null)

}
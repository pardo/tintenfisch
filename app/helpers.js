
var H = {
  goFullscreen: function (elem) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen()
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen()
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen()
    }
  },

  FisherYatesShuffle: function (myArray) {
    var i = myArray.length
    var j
    var tempi
    var tempj
    if (i === 0) return false
    while (--i) {
      j = Math.floor(Math.random() * (i + 1))
      tempi = myArray[i]
      tempj = myArray[j]
      myArray[i] = tempj
      myArray[j] = tempi
    }
    return myArray
  },

  range: function (start, end, step) {
    var range = []
    var i
    switch (arguments.length) {
      case 1:
        for (i = 0; i < start; i++) { range.push(i) }
        break
      case 2:
        for (i = start; i < end; i++) { range.push(i) }
        break
      case 3:
        if (start < end && step > 0) {
          for (i = start; i < end;) { range.push(i); i += step }
        } else if (start > end && step < 0) {
          for (i = start; i > end;) { range.push(i); i += step }
        }
        break
    }
    return range
  },

  distancePoints: function (p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
  },

  distance: function (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
  },

    // 57.29577951308232 = 180 / Math.PI
  rad2deg: function (d) {
    return d * 57.29577951308232
  },

  deg2rad: function (d) {
    return d / 57.29577951308232
  },

  angleBetweenTwoPoints: function (x1, y1, x2, y2) {
    var a = Math.atan2(y2 - y1, x2 - x1)
    console.log(a)
    if (a < 0) { a += Math.PI * 2 }
    return a
  },

  pointFollowingAngle: function (pos, angle, distance) {
        // angle should be radians
        // 0-360 0 mean east 90 south 180 west 270 north in degrees
    return {
      x: pos.x + Math.cos(angle) * distance,
      y: pos.y + Math.sin(angle) * distance
    }
  },

  mapObj: function (func, obj) {
        // func(obj , key, index)
    var keys = Object.keys(obj)
    var result = []
    for (var i = 0; i < keys.length; i++) {
      result.push(
                func(obj[keys[i]], keys[i], i)
            )
    }
    return result
  },

  getWindowSize: function () {
    var winW = 0
    var winH = 0
    if (document.body && document.body.offsetWidth) {
      winW = document.body.offsetWidth
      winH = document.body.offsetHeight
    }
    if (document.compatMode === 'CSS1Compat' &&
            document.documentElement &&
            document.documentElement.offsetWidth) {
      winW = document.documentElement.offsetWidth
      winH = document.documentElement.offsetHeight
    }
    if (window.innerWidth && window.innerHeight) {
      winW = window.innerWidth
      winH = window.innerHeight
    }
    return {x: winW, y: winH}
  },

  downloadText: function (filename, text) {
    var pom = document.createElement('a')
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    pom.setAttribute('download', filename)
    pom.click()
  },

  getId: function (length) {
        // with a length of 6 the first collision occurs after more than 9000000 of ids
    var base62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var str = ''
    length = length || 5
    for (var i = 0; i < length; i++) {
      str += base62[Math.floor(Math.random() * 62)]
    }
    return str
  },
  // extracted from underscore
  debounce: function (func, wait, immediate) {
    var timeout
    var result
    return function () {
      var context = this
      var args = arguments
      var later = function () {
        timeout = null
        if (!immediate) result = func.apply(context, args)
      }
      var callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) result = func.apply(context, args)
      return result
    }
  },

  throttle: function (func, wait) {
    var context, args, timeout, throttling, more, result
    var whenDone = H.debounce(function () { more = throttling = false }, wait)
    return function () {
      context = this; args = arguments
      var later = function () {
        timeout = null; if (more) func.apply(context, args)
        whenDone()
      }; if (!timeout) timeout = setTimeout(later, wait)
      if (throttling) {
        more = true
      } else {
        result = func.apply(context, args)
      }whenDone(); throttling = true; return result
    }
  }
}

export default H

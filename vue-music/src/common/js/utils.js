function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export function shuffle(paramArr) {
  let arr = paramArr.slice()
  let len = arr.length
  for (let i = 0; i < len; i++) {
    let j = getRandomInt(0, i)
    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
  return arr
}

export function debounce(func, delay) {
  var timer
  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
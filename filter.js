const urlParser = document.createElement('a')

// 获取域名函数
export function domain (url) {
  urlParser.href = url
  return urlParser.hostname
}

// 获取某一时刻到现在的时间点
export function fromNow (time) {
  // Date.now() 方法返回自1970年1月1日 00:00:00 UTC到当前时间的毫秒数。
  const between = Date.now() / 1000 - Number(time)   //
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } 
  else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } 
  else {
    return pluralize(~~(between / 86400), ' day')
  }
}

function pluralize(time, label) {
    if (time === 1) {
        return time + label
    }

    return time + label + 's';
}

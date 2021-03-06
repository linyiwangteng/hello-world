const urlParser = document.createElement('a');

// 获取域名函数
 function domain (url) {
  urlParser.href = url;
  return urlParser.hostname
}

// 获取某一时刻到现在的时间点
 function fromNow (time) {
  // Date.now() 方法返回自1970年1月1日 00:00:00 UTC到当前时间的毫秒数。
  const between = Date.now() / 1000 - Number(time);   //
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
// Tips:两个过滤器函数：domain获取传入链接的域名；fromNow获取一段时间（例如：2天前：即为当前时间到创建的时间为2天）；

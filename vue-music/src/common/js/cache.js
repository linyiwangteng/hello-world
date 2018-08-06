import Storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15
// 插入数组
function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return true
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}
function deleteArray(arr, val, commpare, maxLen) {
  const index = arr.findIndex(commpare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function saveSearch(query) {
  let searches = Storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  Storage.set(SEARCH_KEY, searches)
  return searches
}
export function localSearch() {
  let searches = Storage.get(SEARCH_KEY, [])
  return searches
}
export function deleteSearch(query) {
  let searches = Storage.get(SEARCH_KEY, [])
  deleteArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  Storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  Storage.remove(SEARCH_KEY)
  return []
}
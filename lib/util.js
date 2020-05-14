const oneDay = 24 * 60 * 60 * 1000
const z = 'Z+8'

function datetime(val) {
	let date = Object.prototype.toString.call(val) === '[object Date]' ? val : new Date(val)
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  let str =  [y, (m < 10 ? '0' : '') + m, (d < 10 ? '0' : '') + d].join('-') + ' ' + date.toLocaleTimeString('zh-Hant-TW', { hour12: false })
  return str
}

function date(val) {
	let date = Object.prototype.toString.call(val) === '[object Date]' ? val : new Date(val)
  let m = date.getMonth() + 1
  let d = date.getDate()
  return date.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d
}

function singleLine(content) {
  return content.replace(/[\t]+/g, ' ').replace(/[\r\n]+/g, ' ').trim()
}

exports.oneDay = oneDay
exports.z = z
exports.datetime = datetime
exports.date = date
exports.singleLine = singleLine
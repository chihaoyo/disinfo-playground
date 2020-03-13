const readline = require('readline')
const fs = require('fs')
const datasets = '0archive-datasets'
const z = 'Z+8'
const oneDay = 24 * 60 * 60 * 1000

let from = '2018-01-01'
let to = '2020-03-04'

from = new Date(from + z)
to = new Date(to + z)

function getDateString(date) {
  let m = date.getMonth() + 1
  let d = date.getDate()
  return date.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d
}

let keywords = ['武漢']

let totalStat = {
  count: 0,
  matches: 0
}
let dailyStat = {}
for(let d = +from; d < +to; d += oneDay) {
  let dateObj = new Date(d)
  let dateStr = getDateString(dateObj)
  dailyStat[dateStr] = {}

  let count = 0
  let matches = 0
  const readInterface = readline.createInterface({
    input: fs.createReadStream(datasets + '/publications/' + dateStr + '.jsonl')
  })
  readInterface.on('line', line => {
    count += 1
    if(keywords.some(keyword => line.includes(keyword))) {
      matches += 1
    }
  })
  readInterface.on('close', line => {
    totalStat.count += count
    totalStat.matches += matches
    dailyStat[dateStr].count = count
    dailyStat[dateStr].matches = matches
  })
}

process.on('exit', () => {
  console.log(dailyStat)
  console.log(totalStat)
})

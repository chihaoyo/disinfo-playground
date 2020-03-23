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

let searches = [
  ['武漢'],
  ['新冠']
]

let totalStat = {
  count: 0,
  matches: searches.map(search => 0)
}
let dailyStat = {}
for(let d = +from; d < +to; d += oneDay) {
  let dateObj = new Date(d)
  let dateStr = getDateString(dateObj)
  dailyStat[dateStr] = {}

  let dayCount = 0
  let datMatches = searches.map(search => 0)
  const readInterface = readline.createInterface({
    input: fs.createReadStream(datasets + '/publications/' + dateStr + '.jsonl')
  })
  readInterface.on('line', line => {
    dayCount += 1
    searches.forEach((keywords, index) => {
      if(keywords.some(keyword => line.includes(keyword))) {
        datMatches[index] += 1
      }
    })
  })
  readInterface.on('close', line => {
    totalStat.count += dayCount
    totalStat.matches = totalStat.matches.map((match, index) => match + datMatches[index])
    dailyStat[dateStr].count = dayCount
    dailyStat[dateStr].matches = datMatches
  })
}

process.on('exit', () => {
  for(dateStr in dailyStat) {
    const dayStat = dailyStat[dateStr]
    console.log(dateStr + '\t' + dayStat.count + '\t' + dayStat.matches.join('\t'))
  }
  console.log('total' + '\t' + totalStat.count + '\t' + totalStat.matches.join('\t'))
})

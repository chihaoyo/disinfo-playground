const readline = require('readline')
const fs = require('fs')
const datasets = '0archive-datasets'

let producers = []

const readInterface = readline.createInterface({
  input: fs.createReadStream(datasets + '/producers.jsonl')
})
readInterface.on('line', line => {
  producers.push(JSON.parse(line))
})
readInterface.on('close', line => {
  for(let p of producers) {
    console.log(`${p.name}\t${p.classification}\t${p.url}`)
  }
})

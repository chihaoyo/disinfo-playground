const fs = require('fs')
const baseDir = '.'
const dataDir = `${baseDir}/0archive-public-datasets/PTT-HatePolitics`

let items = require(dataDir + '/2020-01.json')

let urls = {}
items.forEach(item => {
	if(item.urls) {
		item.urls.forEach(url => {
			urls[url] = (urls[url] ? urls[url] : 0) + 1
		})
	}
})

let tsv = []

urls = Object.keys(urls).map(url => ({
	url,
	count: urls[url]
}))
urls.sort((a, b) => b.count - a.count)

tsv = urls.map(o => [o.url, o.count].join('\t'))
fs.writeFileSync('urls.tsv', tsv.join('\n'))

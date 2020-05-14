const readline = require('readline')
const fs = require('fs')
const unzipper = require('unzipper')

const baseDir = '.'
const util = require(baseDir + '/lib/util.js')

let ids = {}
let rows = []

let args = process.argv.slice(2)
let month = args.length > 0 ? args[0] : '2020-01'

let dataDir = `${baseDir}/0archive-public-datasets/PTT-HatePolitics`
let zipFile = `${dataDir}/${month}.zip`
let dir = `${dataDir}/${month}`

async function main() {
	if(fs.existsSync(zipFile)) {
		console.log('unzip', zipFile, '...')
		await fs.createReadStream(zipFile).pipe(unzipper.Extract({ path: dir })).on('entry', entry => entry.autodrain()).promise()
	}
	if(fs.existsSync(dir)) {
		console.log('aggregate', month, '...')

		fs.readdir(dir, (e, files) => {
			files.forEach(file => {
				readInterface = readline.createInterface({
			  	input: fs.createReadStream(`${dir}/${file}`)
				})
				readInterface.on('line', line => {
					let row = JSON.parse(line)
					let id = row.id
					let save = false
					if(ids[id] !== undefined) {
						let maxVersion = ids[id]
						if(row.version > maxVersion) {
							ids[id] = row.version
							save = true
						}
					} else {
						ids[id] = row.version
						save = true
					}
					if(save) {
						rows.push(row)
					}
				})
			})
		})
		process.on('exit', () => {
			console.log('write', rows.length, 'rows', '...')
			rows.sort((a, b) => new Date(a.published_at) - new Date(b.published_at))
			fs.writeFileSync(`${dataDir}/${month}.json`, JSON.stringify(rows, null, '\t'))
		})
	}
	else {
		console.log(month, 'not found')
	}
}

main()
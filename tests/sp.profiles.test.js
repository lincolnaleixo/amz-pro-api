const jsonfile = require('jsonfile')
const path = require('path')
const AmzAdsApi = require('../src/core')
const rootPath = path.join(__dirname, '..');

(async () => {
	const testConfig = jsonfile.readFileSync(path.join(rootPath, 'tests', 'config', 'config.test.json'))
	const feature = 'core/profiles'
	const amzAdsApi = new AmzAdsApi(testConfig.CREDENTIALS)
	const options = {
		action: 'listProfiles',
		api: 'profiles',
	}
	const profilesList = await amzAdsApi.request(options)
	const dumpFolder = `tests/dump/${feature}/${options.action}.json`

	jsonfile.writeFileSync(dumpFolder, profilesList, { spaces: 2 })
	console.log(`${options.action} data saved on dump folder ${dumpFolder}`)
})()

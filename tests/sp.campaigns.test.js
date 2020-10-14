const jsonfile = require('jsonfile')
const path = require('path')
const AmzAdsApi = require('../src/core')
const testConfig = require('./config/config.test.json')
const apiOperations = require('../resources/apiOperations').campaigns
const feature = 'sp/campaigns';

(async () => {
	const amzAds = new AmzAdsApi(testConfig.CREDENTIALS)
	const dumpFolder = path.join(__dirname, 'dump', feature)

	for (const operationKey in apiOperations) {
		const operation = apiOperations[operationKey]
		// const options = {
		// 	api: 'campaigns',
		// 	action: apiOperations[operationKey],
		// 	params: testConfig.CAMPAIGNS[operation].params,
		// }
		const responseData = await amzAds.request({
			api: 'campaigns',
			action: apiOperations[operationKey],
			profileId: testConfig.PROFILE_ID,
			params: testConfig.CAMPAIGNS[operation].params || undefined,
		})

		// console.log(JSON.stringify(response, null, 2))
		jsonfile.writeFileSync(path.join(dumpFolder, `${apiOperations[operationKey]}.json`), responseData, { spaces: 2 })
		console.log(`${apiOperations[operationKey]} response saved on ${dumpFolder}/${apiOperations[operationKey]}.json`)
	}
})()

const Spidering = require('spidering')
const cawer = require('cawer')
const random = require('random')
const axios = require('axios')
const cheerio = require('cheerio')

class Product {

	constructor(env = 'PRODUCTION') {

		// TODO multiples countries
		process.env.ENVIROMENT = env
		this.spidering = new Spidering()
		this.baseHost = 'https://www.amazon.com'

		// this.proxies = [
		// 	'64.227.14.140:8080',
		// 	'207.180.223.239:80',
		// 	'https://68.183.188.100:3128',
		// 	'139.99.105.186:80',
		// 	'https://140.227.230.77:8080',
		// 	'68.183.208.248:80',
		// ]
		this.zipCode = '11001'

	}

	async getInfo(asin) {

		await this.spidering.createBrowser()
		await this.spidering.createPage()
		await this.spidering.navigateTo(`${this.baseHost}/dp/${asin}`)

		const productTitle = await this.spidering.evaluate('document.querySelector(\'#productTitle\').innerText')

		const quantityReviews = await this.spidering
			.evaluate("parseInt(document.querySelector('#acrCustomerReviewText').innerText.split(' ')[0].replace(',',''),10)")

		const avgReviewsRating = await this.spidering.evaluate("parseFloat(document.querySelector('i.a-icon-star span').innerText.split('out')[0].trim())")

		const asinInfo = {
			asin, productTitle, quantityReviews, avgReviewsRating,
		}

		await this.spidering.closeBrowser()

		return asinInfo

	}

	async getRankingPosition(asin, keyword) {

		let rankingPosition = 0
		let navigationPage = 0
		const cookiesPath = 'cookies/amazon.txt'

		const isThereNextPage = `document.querySelector('.a-pagination li.a-last:not(.a-disabled)') !== null`
		const asinsPageListElement = `Array.from(document.querySelectorAll('.s-result-list.s-search-results.sg-row div[data-asin]:not(.AdHolder)')).filter(item=>item.getAttribute('data-asin') !== '').map(item=>item.getAttribute('data-asin'))`
		const nextPageButtonElement = `.a-pagination li.a-last`

		// for (let i = 0; i < this.proxies.length; i += 1) {
		//
		// 	const proxy = this.proxies[i]
		//
		//
		//
		// }

		await this.spidering.createBrowser()
		// await this.spidering.setCookies(cookiesPath)
		await this.spidering.createPage()
		await this.spidering.navigateTo(this.baseHost)

		await this.setZipCode(this.zipCode)

		await this.search(keyword)

		while (true) {

			const asinsPageList = await this.spidering.evaluate(asinsPageListElement)
			navigationPage += 1

			if (asinsPageList.indexOf(asin) === -1) {

				await this.scrollPage(this.spidering.page, 1)

				if (await this.spidering.evaluate(isThereNextPage) === false) {

					console.log('There is no next page button available, ending')
					break

				}

				console.log(`Asin ${asin} not found on page ${navigationPage}. Clicking next page button`)
				rankingPosition += asinsPageList.length
				await this.spidering.click(nextPageButtonElement)
				cawer.sleep(2)
				continue

			}

			console.log(`ASIN found on page ${navigationPage}`)
			rankingPosition += parseInt(asinsPageList.indexOf(asin), 10) + 1
			await this.spidering.closeBrowser()
			break

		}

		// await this.spidering.saveCookies(cookiesPath)

		return rankingPosition

	}

	async scrollPage(page, scrollCount) {

		try {

			let loop = true
			while (loop) {

				try {

					for (let i = 0; i < scrollCount; i += 1) {

						console.log(`[${i + 1}/${scrollCount}] scrolling...`)
						await page.evaluate((_) => {

							window.scrollBy(0, window.innerHeight)
							window.scrollTo(0, document.body.scrollHeight)

						})
						cawer.sleep(3)

					}
					loop = false

				} catch (error) {

					console.log(`Error on scrolling: ${error}`)
					console.log('trying again in 30 seconds')
					cawer.sleep(30)

				}

			}

		} catch (error) {

			console.log('Error on scrollPage')
			console.log(error.message)

		}

	}

	async search(keyword) {

		const waitElement = '.s-result-list.s-search-results.sg-row'
		// const urlPage = `https://www.amazon.com/s?k=${keyword.replace(' ', '+')}`

		await this.spidering.typeInput('#twotabsearchtextbox', keyword)
		await this.spidering.click('#navbar input[value="Go"]', waitElement)

		return true

	}

	async setZipCode(zipCode) {

		const addressNowElement = `document.querySelector('#nav-global-location-slot').innerText`

		const addressNowText = await this.spidering.evaluate(addressNowElement)
		if (addressNowText.indexOf(zipCode) === -1) {

			await this.spidering.click('.nav-a.nav-a-2.a-popover-trigger.a-declarative')
			await this.spidering.typeInput('#GLUXZipUpdateInput', zipCode)
			await this.spidering.click('input[aria-labelledby=GLUXZipUpdate-announce]')
			await cawer.sleep(2)
			await this.spidering.click('.a-popover-footer .a-button-inner.a-declarative', '#twotabsearchtextbox')

		}

		return true

	}

	async getMainCategories() {

		// await this.spidering.createBrowser()
		// await this.spidering.createPage()
		// await this.spidering.navigateTo(`https://www.amazon.com/Best-Sellers/zgbs`)

		const response = await axios.get(`https://www.amazon.com/Best-Sellers/zgbs`)
		const $ = cheerio.load(response.data)
		const mainCategoiresList = []
		const mainCategoriesListElement = `#zg_browseRoot ul li`

		$(mainCategoriesListElement)
			.each((i, elem) => mainCategoiresList
				.push({
					name: $(elem)
						.text(),
					url: $(elem)
						.find('a')
						.attr('href'),
				}))

		return mainCategoiresList

	}

	async getTop100Products(category) {

		const mainCategoriesList = await this.getMainCategories()
		const productsList = []
		const { url } = mainCategoriesList.find((item) => item.name === category)

		const response = await axios.get(url)
		const $ = cheerio.load(response.data)
		const productsListElement = `#zg-ordered-list .zg-item-immersion`

		console.log($(productsListElement)
			.html())

		$(productsListElement)
			.each((i, elem) => productsList
				.push({
					name: $(elem)
						.find($('div.p13n-sc-truncate'))
						.text()
						.replace('\n', '')
						.trim(),
					url: this.baseHost + $(elem)
						.find('a')
						.attr('href'),
				}))

		return productsList

	}

}

module.exports = Product

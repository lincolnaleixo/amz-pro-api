const Spidering = require('spidering')

class Product {

	constructor(country = 'US') {

		// TODO multiples countries
		this.spidering = new Spidering()
		this.baseHost = 'https://www.amazon.com'

	}

	async getInfo(asin) {

		await this.spidering.createBrowser()
		await this.spidering.createPage()
		await this.spidering.navigateTo(`${this.baseHost}/dp/${asin}`)

		const productTitle = await this.spidering.evaluate(`document.querySelector('#productTitle').innerText`)

		const quantityReviews = await this.spidering
			.evaluate("parseInt(document.querySelector('#acrCustomerReviewText').innerText.split(' ')[0].replace(',',''),10)")

		const avgReviewsRating = await this.spidering.evaluate("parseFloat(document.querySelector('i.a-icon-star span').innerText.split('out')[0].trim())")

		const asinInfo = {
			asin, productTitle, quantityReviews, avgReviewsRating,
		}

		await this.spidering.closeBrowser()

		return asinInfo

	}

}

module.exports = Product

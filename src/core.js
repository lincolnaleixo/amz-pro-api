/* eslint-disable prefer-destructuring */
/* eslint-disable require-jsdoc */
// const Logering = require('logering')
/* eslint-disable max-lines-per-function */
const axios = require('axios').default
const urljoin = require('url-join')
const requiredParams = require('../resources/requiredParams')
// const cawer = new Cawer()

class Core {
	constructor(credentials) {
		this.credentials = credentials
		// this.logger = new Logering(this.api)
		// this.logger = this.logger.get()
	}

	async request(options) {
		try {
			this.api = options.api
			const headers = this.prepareHeaders(options)
			let url = urljoin(requiredParams.endpoint,
				requiredParams[this.api].apiVersion,
				requiredParams[this.api].apiIdentifier,
				requiredParams[this.api][options.action].requestURI)

			for (const paramKey in options.params) {
				const param = options.params[paramKey]
				url = urljoin(url, param)
			}
			const requestItems = {
				headers: {
					...{ 'User-Agent': 'amz-mws-api' },
					...headers,
				},
				method: requiredParams[this.api][options.action].method,
				url,
				responseType: 'json',
			}
			const response = await axios.request(requestItems)
			// const response = await fetch(url, {
			// 	method: requiredParams[this.api][options.action].method,
			// 	headers,
			// })
			// if (await this.isResponseValid(response, options.action)) {
			// const responseData = await response.json()

			return response.data
			// }
		} catch (error) {
			if (error.response && error.response.status) {
				if (error.response.status === 200) return true
				if (error.response.status === 401) {
					console.log('Not authenticated, refreshing token and trying again...')
					await this.refreshToken()

					return this.request(options)
				}
				console.log(`Error on ${options.action}`)
				// console.log(`Status Code: ${error.response.status}: ${error.response.statusText}`)
			}
			throw new Error(error)
		}
	}

	async isResponseValid(response, request) {
		if (response.status === 401) {
			console.log('Not authenticated, refreshing token and trying again...')
			await this.refreshToken()

			return false
		}

		if (response.status !== 200) {
			console.log(`Error on ${request}`)
			console.log(`Status Code: ${response.status}: ${response.statusText}`)
		}

		return true
	}

	prepareHeaders(options) {
		const headers = requiredParams[this.api].headers

		headers.Authorization = requiredParams.AuthorizationType
		+ this.credentials.ADVERTISING_ACCESS_TOKEN
		headers['Amazon-Advertising-API-ClientId'] = this.credentials.ADVERTISING_CLIENT_ID
		if (options.profileId) headers['Amazon-Advertising-API-Scope'] = options.profileId

		return headers
	}

	prepareRequiredParams() {
		const params = new URLSearchParams()

		params.append('grant_type', 'refresh_token')
		params.append('client_id', this.credentials.ADVERTISING_CLIENT_ID)
		params.append('refresh_token', this.credentials.ADVERTISING_REFRESH_TOKEN)
		params.append('client_secret', this.credentials.ADVERTISING_CLIENT_SECRET)

		return params
	}

	async refreshToken() {
		// TODO change credentials structure so we can save the refresh info
		try {
			const params = this.prepareRequiredParams()
			const { headers } = requiredParams.core.refreshToken
			const requestItems = {
				headers: {
					...{ 'User-Agent': 'amz-ads-api' },
					...headers,
				},
				method: requiredParams.core.refreshToken.method,
				url: requiredParams.authorizationURL,
				responseType: 'json',
			}
			requestItems.data = params
			const response = await axios.request(requestItems)
			// const response = await fetch(requiredParams.authorizationURL, {
			// 	body: params,
			// 	headers,
			// 	method: requiredParams.core.refreshToken.method,
			// })
			// const data = await response.json()

			if (response.status === 200 && response.statusText === 'OK') {
				console.log('Refreshed with success!')
				this.credentials.ADVERTISING_ACCESS_TOKEN = response.data.access_token

				return
			}

			if (response.data.toString('latin1').error_description.indexOf('invalid grant parameter : code') > -1) {
				console.log('Refresh token is not valid')
			} else {
				console.log(response.data.toString('latin1'))
			}

			console.log(`Status: ${response.status}`)
			console.log(`Text: ${response.statusText}`)
		} catch (error) {
			console.log(`Error on doRefreshToken: ${error.stack}`)
		}
	}

}

module.exports = Core

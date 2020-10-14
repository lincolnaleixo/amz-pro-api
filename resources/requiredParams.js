module.exports = {
	core: { refreshToken: {
		headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
		method: 'POST',
	} },
	profiles: {
		headers: { 'Content-Type': 'application/json' },
		method: 'GET',
		apiVersion: 'v2',
		apiIdentifier: 'profiles',
		listProfiles: {
			method: 'GET',
			requestURI: '',
		},
	},
	campaigns: {
		headers: { 'Content-Type': 'application/json' },
		getCampaign: {
			method: 'GET',
			requestURI: '',
		},
		getCampaignEx: {
			method: 'GET',
			requestURI: '/extended',
		},
		createCampaigns: {
			method: 'POST',
			requestURI: '',
		},
		listCampaigns: {
			method: 'GET',
			requestURI: '',
		},
		listCampaignsEx: {
			method: 'GET',
			requestURI: '/extended',
		},
		apiVersion: 'v2',
		apiIdentifier: 'campaigns',
	},
	adGroups: {
		headers: { 'Content-Type': 'application/json' },
		getAdGroup: {
			method: 'GET',
			requestURI: '',
		},
		getAdGroupEx: {
			method: 'GET',
			requestURI: '/extended',
		},
		createAdGroups: {
			method: 'POST',
			requestURI: '',
		},
		listAdGroups: {
			method: 'GET',
			requestURI: '',
		},
		listAdGroupsEx: {
			method: 'GET',
			requestURI: '/extended',
		},
		apiVersion: 'v2',
		apiIdentifier: 'adGroups',
	},
	keywords: {
		headers: { 'Content-Type': 'application/json' },
		getBiddableKeyword: {
			method: 'GET',
			requestURI: '',
		},
		getBiddableKeywordEx: {
			method: 'GET',
			requestURI: '/extended',
		},
		listBiddableKeywords: {
			method: 'GET',
			requestURI: '',
		},
		listBiddableKeywordsEx: {
			method: 'GET',
			requestURI: '/extended',
		},
		apiVersion: 'v2',
		apiIdentifier: 'keywords',
	},
	AuthorizationType: 'Bearer ',
	endpoint: 'https://advertising-api.amazon.com',
	authorizationURL: 'https://api.amazon.com/auth/o2/token',
	other: {
		'Content-Type': 'application/json',
		'Amazon-Advertising-API-ClientId': '',
		'User-Agent': 'amazon-advertising-lincoln',
		Accept: '*/*',
		'Cache-Control': 'no-cache',
		'Conquer-Token': 'askdjh1029387aksdhg123978',
		'Content-Encoding': 'zlib',
	},
}

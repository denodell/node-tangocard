import request from 'request-promise'
import fs from 'fs'
import path from 'path'

const ca = fs.readFileSync(path.join(__dirname, '../ca_cert', 'digicert_chain.pem'))

export default class TangoCard {
	token = ''
	domain = 'https://api.tangocard.com'

	constructor(options) {
		const { name, key, domain = this.domain } = options
		this.token = new Buffer(`${name}:${key}`).toString('base64')
		this.domain = domain
	}

	request(method, uri, payload) {
		method = method.toUpperCase() || 'GET'

		const options = {
			uri: `${this.domain}${uri}`,
			method,
			qs: method === 'GET' ? payload : null,
			headers: {
				'Authorization': `Basic ${this.token}`,
			},
			json: true,
			body: method !== 'GET' ? payload : null,
			agentOptions: {
				ca,
			},
		}

		return request(options).then(body => {
			if (!body) {
				throw new Error('API Response is empty')
			}

			if (body.errors && body.errors.length > 0) {
				throw new Error(body.errors.join('. '))
			}

			return body
		}).catch(err => {
			return err.error
		})
	}

	getCustomers = () => this.request('GET', '/raas/v2/customers')
	getCustomerInfo = (customerId) => this.request('GET', `/raas/v2/customers/${customerId}`)
	getAccountsByCustomer = (customerId) => this.request('GET', `/raas/v2/customers/${customerId}/accounts`)
	createCustomer = (payload) => this.request('POST', '/raas/v2/customers', payload)
	createCustomerAccount = (customerId, payload) => this.request('POST', `/raas/v2/customers/${customerId}/accounts`, payload)
	getAccounts = () => this.request('GET', '/raas/v2/accounts')
	getAccountInfo = (accountId) => this.request('GET', `/raas/v2/accounts/${accountId}`)
	getCreditCards = () => this.request('GET', '/raas/v2/creditCards')
	registerCreditCard = (payload) => this.request('POST', '/raas/v2/creditCards', payload)
	getCreditCardInfo = (creditCardToken) => this.request('GET', `/raas/v2/creditCards/${creditCardToken}`)
	fundAccount = (payload) => this.request('POST', '/raas/v2/creditCardDeposits', payload)
	deleteCreditCard = (payload) =>  this.request('POST', '/raas/v2/creditCardUnregisters', payload)
	getCatalogs = () => this.request('GET', '/raas/v2/catalogs')
	placeOrder = (payload) => this.request('POST', '/raas/v2/orders', payload)
	getOrderInfo = (orderId) => this.request('GET', `/raas/v2/orders/${orderId}`)
	getOrderHistory = (qs) => this.request('GET', '/raas/v2/orders', qs)
}

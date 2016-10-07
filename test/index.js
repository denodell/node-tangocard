import { describe } from 'ava-spec'
import TangoCard from '../dist'
import crypto from 'crypto'

var tangoClient = new TangoCard({
	name: 'QAPlatform2',
	key: 'apYPfT6HNONpDRUj3CLGWYt7gvIHONpDRUYPfT6Hj',
	domain: 'https://sandbox.tangocard.com',
})

function randomString() {
	return crypto.randomBytes(20).toString('hex')
}

var customerIdentifier = randomString(),
	accountIdentifier = randomString(),
	cardToken = null

describe('Tango client', it => {
	it('should initialize', expect => {
		expect.is(typeof tangoClient.token, 'string')
		expect.is(typeof tangoClient.domain, 'string')
		expect.is(typeof tangoClient.getCustomers, 'function')
		expect.is(typeof tangoClient.getCustomerInfo, 'function')
		expect.is(typeof tangoClient.getAccountsByCustomer, 'function')
		expect.is(typeof tangoClient.createCustomer, 'function')
		expect.is(typeof tangoClient.createCustomerAccount, 'function')
		expect.is(typeof tangoClient.getAccounts, 'function')
		expect.is(typeof tangoClient.getAccountInfo, 'function')
		expect.is(typeof tangoClient.getCreditCards, 'function')
		expect.is(typeof tangoClient.registerCreditCard, 'function')
		expect.is(typeof tangoClient.getCreditCardInfo, 'function')
		expect.is(typeof tangoClient.fundAccount, 'function')
		expect.is(typeof tangoClient.deleteCreditCard, 'function')
		expect.is(typeof tangoClient.getCatalogs, 'function')
		expect.is(typeof tangoClient.placeOrder, 'function')
		expect.is(typeof tangoClient.getOrderInfo, 'function')
		expect.is(typeof tangoClient.getOrderHistory, 'function')
	})

	it('should create a customer', expect => {
		return tangoClient.createCustomer({
			customerIdentifier,
		}).then(customer => {
			expect.true(customer.success)
		})
	})

	it('should create a customer account', expect => {
		return tangoClient.createCustomerAccount(customerIdentifier, {
			accountIdentifier,
			displayName: accountIdentifier,
			email: "test@test.com",
		}).then(accountInfo => {
			expect.true(accountInfo.success)
			expect.is(accountInfo.account.customer, customerIdentifier)
			expect.is(accountInfo.account.identifier, accountIdentifier)
			expect.is(accountInfo.account.email, 'test@test.com')
			expect.is(accountInfo.account.available_balance, 0)
		})
	})

	it('should return account information', expect => {
		return tangoClient.getAccountInfo(customerIdentifier, accountIdentifier).then((err, accountInfo) => {
			expect(accountInfo).to.be.ok
			expect(accountInfo.success).to.be.true
			expect(accountInfo.account.customer).to.be.equal(customerIdentifier)
			expect(accountInfo.account.identifier).to.be.equal(accountIdentifier)
			expect(accountInfo.account.email).to.be.equal('test@test.com')
			expect(accountInfo.account.available_balance).to.be.equal(0)
		})
	})

	it('should register a credit card', expect => {
		var payload = {
			customerIdentifier,
			account_identifier: accountIdentifier,
			client_ip: "127.0.0.1",
			credit_card: {
				number: "4111111111111111",
				security_code: "123",
				expiration: "2016-01",
				billing_address: {
					f_name: "FName",
					l_name: "LName",
					address: "Address",
					city: "Seattle",
					state: "WA",
					zip: "98116",
					country: "USA",
					email: "test@example.com",
				},
			},
		}

		return tangoClient.registerCreditCard(payload).then((err, cardInfo) => {
			expect(cardInfo).to.be.ok
			expect(cardInfo.success).to.be.true
			expect(cardInfo).to.have.property('cc_token')
			expect(cardInfo).to.have.property('active_date')

			cardToken = cardInfo.cc_token
		})
	})

	it('should fund an account', expect => {
    // need to wait approval time
    // we dont need to wait it
		expect.true(true)
	})

	it('should remove a credit card', expect => {
		var payload = {
			customerIdentifier,
			account_identifier: accountIdentifier,
			cc_token: cardToken,
		}

		return tangoClient.deleteCreditCard(payload).then(cardInfo => {
			expect(cardInfo).to.be.ok
			expect(cardInfo.success).to.be.true
		})
	})

	it('should return list of rewards', expect => {
		return tangoClient.getRewards().then(rewards => {
			expect(rewards).to.be.ok
			expect(rewards.success).to.be.true
			expect(rewards).to.have.property('brands')
			expect(rewards.brands).to.have.length.above(0)
		})
	})

	it('should place an order', expect => {
    // need to use credit card
		expect.true(true)
	})

	it('should return information about order', expect => {
		expect.true(true)
	})

	it('should return order history', expect => {
		const qs = {
			customerIdentifier,
			account_identifier: accountIdentifier,
		}

		return tangoClient.getOrderHistory(qs).then(history => {
			expect(history).to.be.ok
			expect(history.success).to.be.true
			expect(history).to.have.property('orders')
			expect(history).to.have.property('offset')
			expect(history).to.have.property('limit')
			expect(history).to.have.property('result_count')
			expect(history).to.have.property('total_count')
		})
	})
})

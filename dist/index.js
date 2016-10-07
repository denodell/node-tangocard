'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('babel-polyfill');

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ca = _fs2.default.readFileSync(_path2.default.join(__dirname, '../ca_cert', 'digicert_chain.pem'));

var TangoCard = function () {
	function TangoCard(options) {
		var _this = this;

		_classCallCheck(this, TangoCard);

		this.token = '';
		this.domain = 'https://api.tangocard.com';

		this.getCustomers = function () {
			return _this.request('GET', '/raas/v2/customers');
		};

		this.getCustomerInfo = function (customerId) {
			return _this.request('GET', '/raas/v2/customers/' + customerId);
		};

		this.getAccountsByCustomer = function (customerId) {
			return _this.request('GET', '/raas/v2/customers/' + customerId + '/accounts');
		};

		this.createCustomer = function (payload) {
			return _this.request('POST', '/raas/v2/customers', payload);
		};

		this.createCustomerAccount = function (customerId, payload) {
			return _this.request('POST', '/raas/v2/customers/' + customerId + '/accounts', payload);
		};

		this.getAccounts = function () {
			return _this.request('GET', '/raas/v2/accounts');
		};

		this.getAccountInfo = function (accountId) {
			return _this.request('GET', '/raas/v2/accounts/' + accountId);
		};

		this.getCreditCards = function () {
			return _this.request('GET', '/raas/v2/creditCards');
		};

		this.registerCreditCard = function (payload) {
			return _this.request('POST', '/raas/v2/creditCards', payload);
		};

		this.getCreditCardInfo = function (creditCardToken) {
			return _this.request('GET', '/raas/v2/creditCards/' + creditCardToken);
		};

		this.fundAccount = function (payload) {
			return _this.request('POST', '/raas/v2/creditCardDeposits', payload);
		};

		this.deleteCreditCard = function (payload) {
			return _this.request('POST', '/raas/v2/creditCardUnregisters', payload);
		};

		this.getCatalogs = function () {
			return _this.request('GET', '/raas/v2/catalogs');
		};

		this.placeOrder = function (payload) {
			return _this.request('POST', '/raas/v2/orders', payload);
		};

		this.getOrderInfo = function (orderId) {
			return _this.request('GET', '/raas/v2/orders/' + orderId);
		};

		this.getOrderHistory = function (qs) {
			return _this.request('GET', '/raas/v2/orders', qs);
		};

		var name = options.name;
		var key = options.key;
		var _options$domain = options.domain;
		var domain = _options$domain === undefined ? this.domain : _options$domain;

		this.token = new Buffer(name + ':' + key).toString('base64');
		this.domain = domain;
	}

	_createClass(TangoCard, [{
		key: 'request',
		value: function request(method, uri, payload) {
			method = method.toUpperCase() || 'GET';

			var options = {
				uri: '' + this.domain + uri,
				method: method,
				qs: method === 'GET' ? payload : null,
				headers: {
					'Authorization': 'Basic ' + this.token
				},
				json: true,
				body: method !== 'GET' ? payload : null,
				agentOptions: {
					ca: ca
				}
			};

			return (0, _requestPromise2.default)(options).then(function (body) {
				if (!body) {
					throw new Error('API Response is empty');
				}

				if (false === body.success && 'string' === typeof body.error_message) {
					throw new Error(body.error_message);
				}

				return body;
			});
		}
	}]);

	return TangoCard;
}();

exports.default = TangoCard;
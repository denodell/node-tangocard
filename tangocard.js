var request = require('request')
  , fs = require('fs')
  , path = require('path');

var certContent = fs.readFileSync(path.join(__dirname, 'ca_cert', 'digicert_chain.pem'));

module.exports = function(options) {
  var token = new Buffer(options.name + ':' + options.key).toString('base64')
    , domain = options.domain || 'https://integration-www.tangocard.com';

  var _request = function(method, uri, payload, callback) {
    if ('undefined' === typeof callback ) {
      callback = payload;
      payload = null;
    }

    method = method.toUpperCase() || 'GET';

    var options = {
      uri: domain + uri
    , method: method
    , qs: 'GET' === method ? payload : null
    , headers: { 'Authorization': 'Basic ' + token }
    , json: true
    , body: 'GET' !== method ? payload : null
    , agentOptions: { ca: certContent }
    };

    return request(options, function(err, req, body) {
      if (err) {
        return callback(err);
      }

      if (!body) {
        return callback(new Error('API Response is empty'));
      }

      if (false === body.success && 'string' === typeof body.error_message) {
        return callback(new Error(body.error_message));
      }

      return callback(null, body);
    });
  };

  return {
		getCustomers: function(callback) {
      return _request('GET', '/raas/v2/customers', callback);
    },

		getCustomerInfo: function(customerId, callback) {
      return _request('GET', '/raas/v2/customers/' + customerId, callback);
    },

		getAccountsByCustomer: function(customerId, callback) {
      return _request('GET', '/raas/v2/customers/' + customerId + '/accounts', callback);
    },

		createCustomer: function(payload, callback) {
      return _request('POST', '/raas/v2/customers', payload, callback);
    },

		createCustomerAccount: function(customerId, payload, callback) {
			return _request('POST', '/raas/v2/customers/' + customerId + '/accounts', payload, callback);
		},

		getAccounts: function(callback) {
      return _request('GET', '/raas/v2/accounts', callback);
    },

    getAccountInfo: function(accountId, callback) {
      return _request('GET', '/raas/v2/accounts/' + accountId, callback);
    },

		getCreditCards: function(callback) {
			return _request('GET', '/raas/v2/creditCards', callback);
		},

    registerCreditCard: function(payload, callback) {
      return _request('POST', '/raas/v2/creditCards', payload, callback);
    },

		getCreditCardInfo(creditCardToken, callback) {
			return _request('GET', '/raas/v2/creditCards/' + creditCardToken, callback);
		},

    fundAccount: function(payload, callback) {
      return _request('POST', '/raas/v2/creditCardDeposits', payload, callback);
    },

    deleteCreditCard: function(payload, callback) {
      return _request('POST', '/raas/v2/creditCardUnregisters', payload, callback);
    },

    getCatalogs: function(callback) {
      return _request('GET', '/raas/v2/catalogs', callback);
    },

    placeOrder: function(payload, callback) {
      return _request('POST', '/raas/v2/orders', payload, callback);
    },

    getOrderInfo: function(orderId, callback) {
      return _request('GET', '/raas/v2/orders/' + orderId, callback);
    },

    getOrderHistory: function(qs, callback) {
      return _request('GET', '/raas/v2/orders', qs, callback);
    }
  }
};

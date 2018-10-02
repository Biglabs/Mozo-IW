
const userReference = require('electron-settings');
var request = require('request');
const R = require('ramda');

const main = require('../main');
const oauth2 = require('./oauth2');
const common = require('./common');
const CONSTANTS = require("../constants").CONSTANTS;

const app_config = require("../app_settings").APP_SETTINGS;
const mozo_service_host = app_config.mozo_services.api.host;


function downloadAddressBook(callback) {
  let options = common.setRequestData();
  if (!options) {
    return;
  }

  options.url = mozo_service_host + "/api/contacts";

  request(options, function(error, response, body) {
    if (!error) {
      if (response.statusCode == 200) {
        const address_book = JSON.parse(body);
        userReference.set(CONSTANTS.ADDRESS_BOOK, address_book);
        if (callback) {
          callback(address_book);
        }
      } else {
        console.log(response.statusCode);
        console.log(body);
        callback(null);
      }
    } else {
      console.log(error);
    }
  });
}

function getAddressBook() {
  return userReference.get(CONSTANTS.ADDRESS_BOOK);
}

function findFromAddressBook(keyword) {
  const address_book = getAddressBook();
  if (!address_book) {
    return [];
  }

  let found_address_book = R.filter(
    x => x.name.includes(keyword) || x.soloAddress.includes(keyword),
    address_book
  );
  return found_address_book;
}

function addAddressBook(data) {
  let options = common.setRequestData();
  if (!options) {
    return;
  }

  options.url = mozo_service_host + "/api/contacts";
  options.method = "POST";
  options.json = true;
  options.body = {
    'name' : data.name,
    'soloAddress' : data.soloAddress
  };

  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) {
      if (!error) {
        if (response.statusCode >= 200 && response.statusCode < 202) {
          downloadAddressBook();
          resolve(body);
        } else {
          console.log(response.statusCode);
          console.log(body);
          resolve(null);
        }
      } else {
        console.log(error);
        reject(error);
      }
    });
  });
}

function updateAddressBook(data) {
  let options = common.setRequestData();
  if (!options) {
    return;
  }

  options.url = mozo_service_host + "/api/contacts" + data.id;
  options.method = "PUT";
  options.json = true;
  options.body = {
    'id' : data.id,
    'name' : data.name,
    'soloAddress' : data.soloAddress
  };

  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) {
      if (!error) {
        if (response.statusCode >= 200 && response.statusCode < 202) {
          downloadAddressBook();
          resolve(body);
        } else {
          console.log(response.statusCode);
          console.log(body);
          resolve(null);
        }
      } else {
        console.log(error);
        reject(error);
      }
    });
  });
}

function deleteAddressBook(id) {
  let options = common.setRequestData();
  if (!options) {
    return;
  }

  options.url = mozo_service_host + "/api/contacts" + data.id;
  options.method = "DELETE";

  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) {
      if (!error) {
        console.log(body);
        if (response.statusCode == 200) {
          downloadAddressBook();
          resolve(body);
        } else {
          console.log(response.statusCode);
          console.log(body);
          resolve(null);
        }
      } else {
        console.log(error);
        reject(error);
      }
    });
  });
}

var AddressBook = {

  'download' : downloadAddressBook,
  'get' : getAddressBook,
  'find' : findFromAddressBook,
  'add' : addAddressBook,
  'update' : updateAddressBook,
  'delete' : deleteAddressBook
};

module.exports = AddressBook;

module.exports = {

  /*
  * Validata retailer registration fields ensuring the fields meet the criteria
  * @param {String} cardId
  * @param {String} accountNumber
  * @param {String} firstName
  * @param {String} lastName
  * @param {String} phoneNumber
  * @param {String} email
  */
  validateRetailerRegistration: async function(cardId, accountNumber, firstName, lastName, email, phoneNumber) {

    var response = {};

    //verify input otherwise return error with an informative message
    if (accountNumber.length < 6) {
      response.error = "Account number must be at least six digits long";
      console.log(response.error);
      return response;
    } else if (!isInt(accountNumber)) {
      response.error = "Account number must be all numbers";
      console.log(response.error);
      return response;
    } else if (accountNumber.length > 25) {
      response.error = "Account number must be less than 25 digits";
      console.log(response.error);
      return response;
    } else if (cardId.length < 1) {
      response.error = "Enter access key";
      console.log(response.error);
      return response;
    } else if (!/^[0-9a-zA-Z]+$/.test(cardId)) {
      response.error = "Card id can be letters and numbers only";
      console.log(response.error);
      return response;
    } else if (firstName.length < 1) {
      response.error = "Enter first name";
      console.log(response.error);
      return response;
    } else if (!/^[a-zA-Z]+$/.test(firstName)) {
      response.error = "First name must be letters only";
      console.log(response.error);
      return response;
    } else if (lastName.length < 1) {
      response.error = "Enter last name";
      console.log(response.error);
      return response;
    } else if (!/^[a-zA-Z]+$/.test(lastName)) {
      response.error = "First name must be letters only";
      console.log(response.error);
      return response;
    } else if (email.length < 1) {
      response.error = "Enter email";
      console.log(response.error);
      return response;
    } else if (!validateEmail(email)) {
      response.error = "Enter valid email";
      console.log(response.error);
      return response;
    } else if (phoneNumber.length < 1) {
      response.error = "Enter phone number";
      console.log(response.error);
      return response;
    } else if (!validatePhoneNumber(phoneNumber)) {
      response.error = "Enter valid phone number";
      console.log(response.error);
      return response;
    } else {
      console.log("Valid Entries");
      return response;
    }

  },

  /*
  * Validata distributor registration fields ensuring the fields meet the criteria
  * @param {String} cardId
  * @param {String} distributorId
  * @param {String} name
  */
  validateDistributorRegistration: async function(cardId, distributorId, name) {

    var response = {};

    //verify input otherwise return error with an informative message
    if (cardId.length < 1) {
      response.error = "Enter access key";
      console.log(response.error);
      return response;
    } else if (!/^[0-9a-zA-Z]+$/.test(cardId)) {
      response.error = "Access key can be letters and numbers only";
      console.log(response.error);
      return response;
    } else if (distributorId.length < 1) {
      response.error = "Enter distributor id";
      console.log(response.error);
      return response;
    } else if (!/^[0-9a-zA-Z]+$/.test(distributorId)) {
      response.error = "Distributor id can be letters and numbers only";
      console.log(response.error);
      return response;
    } else if (name.length < 1) {
      response.error = "Enter company name";
      console.log(response.error);
      return response;
    } else if (!/^[a-zA-Z]+$/.test(name)) {
      response.error = "Company name must be letters only";
      console.log(response.error);
      return response;
    } else {
      console.log("Valid Entries");
      return response;
    }

  },


  /*
  * Validata distributor registration fields ensuring the fields meet the criteria
  * @param {String} cardId
  * @param {String} distributorId
  * @param {String} name
  */
  validateManufactureRegistration: async function(cardId, manufactureId, name) {

    var response = {};

    //verify input otherwise return error with an informative message
    if (cardId.length < 1) {
      response.error = "Enter access key";
      console.log(response.error);
      return response;
    } else if (!/^[0-9a-zA-Z]+$/.test(cardId)) {
      response.error = "Access key can be letters and numbers only";
      console.log(response.error);
      return response;
    } else if (manufactureId.length < 1) {
      response.error = "Enter manufacture id";
      console.log(response.error);
      return response;
    } else if (!/^[0-9a-zA-Z]+$/.test(manufactureId)) {
      response.error = "Manufacture id can be letters and numbers only";
      console.log(response.error);
      return response;
    } else if (name.length < 1) {
      response.error = "Enter company name";
      console.log(response.error);
      return response;
    } else if (!/^[a-zA-Z]+$/.test(name)) {
      response.error = "Company name must be letters only";
      console.log(response.error);
      return response;
    } else {
      console.log("Valid Entries");
      return response;
    }

  },
  /*
  * Validata distributor registration fields ensuring the fields meet the criteria
  * @param {String} cardId
  * @param {String} distributorId
  * @param {String} name
  */
  validateDocumentDetails: async function(cardId, accountNumber, docName, docDesc) {

    var response = {};

    //verify input otherwise return error with an informative message
    if (cardId.length < 1) {
      response.error = "Enter access key";
      console.log(response.error);
      return response;
    } else if (!/^[0-9a-zA-Z]+$/.test(cardId)) {
      response.error = "Access key can be letters and numbers only";
      console.log(response.error);
      return response;
    } else {
      console.log("Valid Entries");
      return response;
    }

  },
  validateDocumentId: async function(cardId, accountNumber, docId) {

    var response = {};

    //verify input otherwise return error with an informative message
    if (docId.length < 1) {
      response.error = "Enter access key";
      console.log(response.error);
      return response;
    }
    else if (cardId.length < 1) {
      response.error = "Enter access key";
      console.log(response.error);
      return response;
    } else if (!/^[0-9a-zA-Z]+$/.test(cardId)) {
      response.error = "Access key can be letters and numbers only";
      console.log(response.error);
      return response;
    } else {
      console.log("Valid Entries");
      return response;
    }

  },

  validateApproveAccessRequest:async function(cardId, retailerAccNo, accessRequestId) {

    var response = {};

    //verify input otherwise return error with an informative message
    if (accessRequestId.length < 1) {
      response.error = "Select valid access request";
      console.log(response.error);
      return response;
    }
    else if (cardId.length < 1) {
      response.error = "Enter access key";
      console.log(response.error);
      return response;
    } else if (!/^[0-9a-zA-Z]+$/.test(cardId)) {
      response.error = "Access key can be letters and numbers only";
      console.log(response.error);
      return response;
    } else {
      console.log("Valid Entries");
      return response;
    }

  },

  validateAccessRequest:async function(cardId,distributorAccNumber, docId,retailerAccNo) {
    var response = {};

    //verify input otherwise return error with an informative message
    if (distributorAccNumber.length < 1) {
      response.error = "Enter access key";
      console.log(response.error);
      return response;
    }
    else if (docId.length < 1) {
      response.error = "Select valid Docuemnt";
      console.log(response.error);
      return response;
    }
    else if (retailerAccNo.length < 1) {
      response.error = "Select a retailer";
      console.log(response.error);
      return response;
    }

    else if (docId=="undefined") {
      response.error = "Select valid document";
      console.log(response.error);
      return response;
    }
    else if (retailerAccNo=="undefined") {
      response.error = "select a retailer";
      console.log(response.error);
      return response;
    }
    else if (cardId.length < 1) {
      response.error = "Enter access key";
      console.log(response.error);
      return response;
    } else if (!/^[0-9a-zA-Z]+$/.test(cardId)) {
      response.error = "Access key can be letters and numbers only";
      console.log(response.error);
      return response;
    } else {
      console.log("Valid Entries");
      return response;
    }

  }


  }

//stackoverflow
function isInt(value) {
  return !isNaN(value) && (function(x) {
    return (x | 0) === x;
  })(parseFloat(value))
}

//stackoverflow
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

//stackoverflow
function validatePhoneNumber(phoneNumber) {
  var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return re.test(String(phoneNumber));
}

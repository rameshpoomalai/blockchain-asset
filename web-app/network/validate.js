module.exports = {

  /*
  * Validata member registration fields ensuring the fields meet the criteria
  * @param {String} cardId
  * @param {String} accountNumber
  * @param {String} firstName
  * @param {String} lastName
  * @param {String} phoneNumber
  * @param {String} email
  */
  validateMemberRegistration: async function(cardId, accountNumber, firstName, lastName, email, phoneNumber) {

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
  * Validata partner registration fields ensuring the fields meet the criteria
  * @param {String} cardId
  * @param {String} partnerId
  * @param {String} name
  */
  validatePartnerRegistration: async function(cardId, partnerId, name) {

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
    } else if (partnerId.length < 1) {
      response.error = "Enter partner id";
      console.log(response.error);
      return response;
    } else if (!/^[0-9a-zA-Z]+$/.test(partnerId)) {
      response.error = "Partner id can be letters and numbers only";
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
  * Validata partner registration fields ensuring the fields meet the criteria
  * @param {String} cardId
  * @param {String} partnerId
  * @param {String} name
  */
  validateRegulatorRegistration: async function(cardId, regulatorId, name) {

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
    } else if (regulatorId.length < 1) {
      response.error = "Enter regulator id";
      console.log(response.error);
      return response;
    } else if (!/^[0-9a-zA-Z]+$/.test(regulatorId)) {
      response.error = "Regulator id can be letters and numbers only";
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

  validateAIRegulatorRegistration: async function(urlhost, urlpath,port,method) {

    var response = {};

    //verify input otherwise return error with an informative message
    if (urlhost.length < 1) {
      response.error = "Enter regulator id(example: retailai.mybluemix.net)";
      console.log(response.error);
      return response;
    } else if (urlpath.length < 1) {
      response.error = "Enter urlpath.(example: /api/score)";
      console.log(response.error);
      return response;
    } else if (!/^[0-9]+$/.test(port)) {
      response.error = "port can only be Integer.(example: 80, 8080)";
      console.log(response.error);
      return response;
    } else if (!method.toUpperCase().includes('POST') && !method.toUpperCase().includes('GET')) {
      response.error = "method can be either GET or POST";
      console.log(response.error);
      return response;
    } else {
      console.log("Valid Entries validateAIRegulatorRegistration");
      return response;
    }

  },

  /*
  * Validata partner registration fields ensuring the fields meet the criteria
  * @param {String} cardId
  * @param {String} partnerId
  * @param {String} name
  */
  validateDocumentDetails: async function(cardId, accountNumber, docName, docDesc,mimetype) {

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

  validateimageDocumentDetails: async function(mimetype,docName) {

    var response = {};

    //verify input otherwise return error with an informative message
    if(mimetype.includes("image/jpeg") || mimetype.includes("image/png") || mimetype.includes("image/jpg"))
    { }
    else{
      response.error = "only image file can be uploaded.";
    }
    if(docName.trim().length==0){
      response.error = "name is needed";
    }
    else{
      console.log("Valid Entries");
    }
      return response;

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

  validateApproveAccessRequest:async function(cardId, memberAccNo, accessRequestId) {

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

  validateAccessRequest:async function(cardId,partnerAccNumber, docId,memberAccNo) {
    var response = {};

    //verify input otherwise return error with an informative message
    if (partnerAccNumber.length < 1) {
      response.error = "Enter access key";
      console.log(response.error);
      return response;
    }
    else if (docId.length < 1) {
      response.error = "Select valid Docuemnt";
      console.log(response.error);
      return response;
    }
    else if (memberAccNo.length < 1) {
      response.error = "Select a member";
      console.log(response.error);
      return response;
    }

    else if (docId=="undefined") {
      response.error = "Select valid document";
      console.log(response.error);
      return response;
    }
    else if (memberAccNo=="undefined") {
      response.error = "select a member";
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

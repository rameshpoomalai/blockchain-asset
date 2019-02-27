const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { BusinessNetworkDefinition, CertificateUtil, IdCard } = require('composer-common');

//declate namespace
const namespace = 'org.ibm.dms';
const retailerNS = 'resource:org.ibm.dms.Retailer#';
const distributorNS = 'resource:org.ibm.dms.Distributor#';
const documentNS = 'resource:org.ibm.dms.Document#';
const manufactureNS = 'resource:org.ibm.dms.Manufacture#';

//in-memory card store for testing so cards are not persisted to the file system
const cardStore = require('composer-common').NetworkCardStoreManager.getCardStore( { type: 'composer-wallet-inmemory' } );

//admin connection to the blockchain, used to deploy the business network
let adminConnection;

//this is the business network connection the tests will use.
let businessNetworkConnection;

let businessNetworkName = 'dms-network';
let factory;


/*
 * Import card for an identity
 * @param {String} cardName The card name to use for this identity
 * @param {Object} identity The identity details
 */
async function importCardForIdentity(cardName, identity) {

  //use admin connection
  adminConnection = new AdminConnection();
  businessNetworkName = 'dms-network';

  //declare metadata
  const metadata = {
      userName: identity.userID,
      version: 1,
      enrollmentSecret: identity.userSecret,
      businessNetwork: businessNetworkName
  };

  //get connectionProfile from json, create Idcard
  const connectionProfile = require('./local_connection.json');
  //const connectionProfile = require('./connection-profile.json');

  const card = new IdCard(metadata, connectionProfile);

  //import card
  await adminConnection.importCard(cardName, card);
}


/*
* Reconnect using a different identity
* @param {String} cardName The identity to use
*/
async function useIdentity(cardName) {

  //disconnect existing connection
  await businessNetworkConnection.disconnect();

  //connect to network using cardName
  businessNetworkConnection = new BusinessNetworkConnection();
  await businessNetworkConnection.connect(cardName);
}


//export module
module.exports = {

  /*
  * Create Retailer participant and import card for identity
  * @param {String} cardId Import card id for retailer
  * @param {String} accountNumber Retailer account number as identifier on network
  * @param {String} firstName Retailer first name
  * @param {String} lastName Retailer last name
  * @param {String} phoneNumber Retailer phone number
  * @param {String} email Retailer email
  */
 registerRetailer: async function (cardId, accountNumber,firstName, lastName, email, phoneNumber) {
    try {

      //connect as admin
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@dms-network');

      //get the factory for the business network
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create retailer participant
      const retailer = factory.newResource(namespace, 'Retailer', accountNumber);
      retailer.firstName = firstName;
      retailer.lastName = lastName;
      retailer.email = email;
      retailer.phoneNumber = phoneNumber;


      //add retailer participant
      const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Retailer');
      await participantRegistry.add(retailer);

      //issue identity
      const identity = await businessNetworkConnection.issueIdentity(namespace + '.Retailer#' + accountNumber, cardId);

      //import card for identity
      await importCardForIdentity(cardId, identity);

      //disconnect
      await businessNetworkConnection.disconnect('admin@dms-network');

      return true;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },

  /*
  * Create Distributor participant and import card for identity
  * @param {String} cardId Import card id for distributor
  * @param {String} distributorId Distributor Id as identifier on network
  * @param {String} name Distributor name
  */
  registerDistributor: async function (cardId, distributorId, name) {

    try {

      //connect as admin
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@dms-network');

      //get the factory for the business network.
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create distributor participant
      const distributor = factory.newResource(namespace, 'Distributor', distributorId);
      distributor.name = name;

      //add distributor participant
      const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Distributor');
      await participantRegistry.add(distributor);

      //issue identity
      const identity = await businessNetworkConnection.issueIdentity(namespace + '.Distributor#' + distributorId, cardId);

      //import card for identity
      await importCardForIdentity(cardId, identity);

      //disconnect
      await businessNetworkConnection.disconnect('admin@dms-network');

      return true;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },




  /*
  * Get Retailer data
  * @param {String} cardId Card id to connect to network
  * @param {String} accountNumber Account number of retailer
  */
  retailerData: async function (cardId, accountNumber) {

    try {

      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //get retailer from the network
      const retailerRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Retailer');
      const retailer = await retailerRegistry.get(accountNumber);

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      //return retailer object
      return retailer;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },

  /*
  * Get Distributor data
  * @param {String} cardId Card id to connect to network
  * @param {String} distributorId Distributor Id of distributor
  */
  distributorData: async function (cardId, distributorId) {

    try {

      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //get retailer from the network
      const distributorRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Distributor');
      const distributor = await distributorRegistry.get(distributorId);

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      //return distributor object
      return distributor;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }

  },


  /*
  * Create Distributor participant and import card for identity
  * @param {String} cardId Import card id for distributor
  * @param {String} distributorId Distributor Id as identifier on network
  * @param {String} name Distributor name
  */
  registerManufacture: async function (cardId, requlatorId, name) {

    try {

      //connect as admin
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@dms-network');

      //get the factory for the business network.
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create distributor participant
      const requlator = factory.newResource(namespace, 'Manufacture', requlatorId);
      requlator.name = name;

      //add distributor participant
      const requlatorRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Manufacture');
      await requlatorRegistry.add(requlator);

      //issue identity
      const identity = await businessNetworkConnection.issueIdentity(namespace + '.Manufacture#' + requlatorId, cardId);

      //import card for identity
      await importCardForIdentity(cardId, identity);

      //disconnect
      await businessNetworkConnection.disconnect('admin@dms-network');

      return true;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },
  /*
  * Get Distributor data
  * @param {String} cardId Card id to connect to network
  * @param {String} distributorId Distributor Id of distributor
  */
  manufactureData: async function (cardId, manufactureId) {

    try {

      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //get retailer from the network
      const manufactureRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Manufacture');
      const manufacture = await manufactureRegistry.get(manufactureId);

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      //return distributor object
      return manufacture;
    }
    catch(err) {
      //print and return error
      console.log("manufactureData:"+err);
      var error = {};
      error.error = err.message;
      return error
    }

  },

  /*
  * Get all distributors data
  * @param {String} cardId Card id to connect to network
  */
  allDistributorsInfo : async function (cardId) {

    try {
      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //query all distributors from the network
      const allDistributors = await businessNetworkConnection.query('selectDistributors');

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      //return allDistributors object
      return allDistributors;
    }
    catch(err) {
      //print and return error
      console.log("allDistributorsInfo:"+err);

      var error = {};
      error.error = err.message;
      return error
    }
  },

    /*
    * Get all distributors data
    * @param {String} cardId Card id to connect to network
    */
    allRetailersInfo : async function (cardId) {

      try {
        //connect to network with cardId
        businessNetworkConnection = new BusinessNetworkConnection();
        await businessNetworkConnection.connect(cardId);

        //query all distributors from the network
        const allRetailers = await businessNetworkConnection.query('selectRetailers');

        //disconnect
        await businessNetworkConnection.disconnect(cardId);

        //return allDistributors object
        return allRetailers;
      }
      catch(err) {
        //print and return error
        console.log("selectRetailers:"+err);

        var error = {};
        error.error = err.message;
        return error
      }
    },
  /*
  * Get all Manufactures
  * @param {String} cardId Card id to connect to network
  */
  selectManufactures: async function (cardId) {

    try {
      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //query UsePoints transactions on the network
      const selectManufactures = await businessNetworkConnection.query('selectManufactures');

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      //return usePointsResults object
      return selectManufactures;
    }
    catch(err) {
      //print and return error
      console.log("selectManufactures:"+err);
      var error = {};
      error.error = err.message;
      return error
    }

  },
  /*
  * Get all approved documents
  * @param {String} cardId Card id to connect to network
  */
  selectDocumentsApproved: async function (cardId) {

    try {
      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);


      const selectDocumentsApproved = await businessNetworkConnection.query('selectDocumentsApproved');

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      //return usePointsResults object
      return selectDocumentsApproved;
    }
    catch(err) {
      console.log("selectDocumentsApproved:"+err);
      var error = {};
      error.error = err.message;
      return error
    }

  },
  /*
  * Get all documents pending for approval
  * @param {String} cardId Card id to connect to network
  */
  selectDocumentsApprovalPending: async function (cardId) {

    try {
      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);


      const selectDocumentsApprovalPending = await businessNetworkConnection.query('selectDocumentsApprovelPending');


      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      //return usePointsResults object
      return selectDocumentsApprovalPending;
    }
    catch(err) {

      console.log("selectDocumentsApprovalPending:"+err);
      var error = {};
      error.error = err.message;
      return error
    }

  },
  /*
  * Get a document
  * @param {String} cardId Card id to connect to network
  */
  getDocumentById: async function (cardId, documentId) {

    try {
      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);


      const assetRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.Document');
      var myDocument = await assetRegistry.get(documentId);

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      console.log("Document:"+myDocument);
      return myDocument;
    }
    catch(err) {
      //print and return error
      console.log("getDocumentById:"+err);
      var error = {};
      error.error = err.message;
      return error
    }

  },
  /*
  * Get all document by given owner
  * @param {String} cardId Card id to connect to network
  */
  selectDocumentByRetailer: async function (cardId,accountNumber) {

    try {
      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);


      //query UsePoints transactions on the network
      //	WHERE (owner == _$owner)
      console.log("selectDocumentByRetailer"+retailerNS +accountNumber)
      const document = await businessNetworkConnection.query('selectDocumentByRetailer',{ owner: retailerNS +accountNumber });

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      //return usePointsResults object
      return document;
    }
    catch(err) {
      //print and return error

      console.log("selectDocumentByRetailer:"+err);
      var error = {};
      error.error = err.message;
      return error
    }

  },


/*
* Get all document by given owner
* @param {String} cardId Card id to connect to network
*/
selectApprovedDocumentByRetailer: async function (cardId,accountNumber) {

  try {
    //connect to network with cardId
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect(cardId);


    //query UsePoints transactions on the network
    //	WHERE (owner == _$owner)
    console.log("selectDocumentByRetailer"+retailerNS +accountNumber)
    const document = await businessNetworkConnection.query('selectApprovedDocumentByRetailer',{ owner: retailerNS +accountNumber });

    //disconnect
    await businessNetworkConnection.disconnect(cardId);

    //return usePointsResults object
    return document;
  }
  catch(err) {
    //print and return error

    console.log("selectDocumentByRetailer:"+err);
    var error = {};
    error.error = err.message;
    return error
  }

},
  /*
  * Get all document by given owner
  * @param {String} cardId Card id to connect to network
  */
  documentList: async function (cardId,accountNumber) {

    try {
      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);


      //query UsePoints transactions on the network
      //	WHERE (owner == _$owner)
      const document = await businessNetworkConnection.query('selectDocumentByRetailer',{ owner: retailerNS+accountNumber });

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      //return usePointsResults object
      return document;
    }
    catch(err) {
      //print and return error
      console.log("Error getting documentList: "+err);
      var error = {};
      error.error = err.message;
      return error
    }

  },
  addDocument: async function (cardId, accountNumber, docName, docDesc, documentId, docPath, originalname, mimetype, size)
  {
    try {

      //connect as admin
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@dms-network');

      //get the factory for the business network.
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();
      console.log("documentId:"+documentId);
      //create distributor participant
      const document = factory.newResource(namespace, 'Document', documentId);
      document.documentId = documentId
      document.docName = docName;
      document.documentDescription = docDesc;
      document.docStatus = false;
      document.docPath = docPath;
      document.originalname = originalname;
      document.mimetype = mimetype;
      document.size = size;
      document.owner = factory.newRelationship(namespace, 'Retailer', accountNumber);

      //add distributor participant
      const assetRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.Document');
      await assetRegistry.add(document);


          //disconnect
      await businessNetworkConnection.disconnect('admin@dms-network');

      return true;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }


  },
  approveDocument: async function (cardId, documentId)
  {
    try {

      //connect as admin
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@dms-network');

      //get the factory for the business network.
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //add distributor participant
      const assetRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.Document');
      var myDocument = await assetRegistry.get(documentId);
      myDocument.docStatus=true;
      await assetRegistry.update(myDocument);

          //disconnect
      await businessNetworkConnection.disconnect('admin@dms-network');

      return true;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }


  },
  /*
  * Get all document by given owner
  * @param {String} cardId Card id to connect to network
  */
  authorizeRequestListByDistributor: async function (cardId,accountNumber) {

    try {
      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);



      //query UsePoints transactions on the network
      const document = await businessNetworkConnection.query('selectAllAuthorizeRequestByDistributor',{ distributor:  distributorNS+accountNumber  });

      //const document = await businessNetworkConnection.query('selectAuthorizeRequest');

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      //return usePointsResults object
      return document;
    }
    catch(err) {
      //print and return error
      console.log("Error getting authorizeRequestList: "+err);
      var error = {};
      error.error = err.message;
      return error
    }




  },
  /*
  * Get all document by given owner
  * @param {String} cardId Card id to connect to network
  */
  authorizeRequestListByRetailer: async function (cardId,accountNumber) {

    try {
      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);




      const document = await businessNetworkConnection.query('selectAllAuthorizeRequestByRetailer',{ retailer:  retailerNS+accountNumber  });

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      //return usePointsResults object
      return document;
    }
    catch(err) {
      //print and return error
      console.log("Error getting authorizeRequestList: "+err);
      var error = {};
      error.error = err.message;
      return error
    }




  },

/*
* Get all document by given owner
* @param {String} cardId Card id to connect to network
*/
selectDocuments: async function (cardId) {

  try {
    //connect to network with cardId
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect(cardId);


    //query UsePoints transactions on the network
    const document = await businessNetworkConnection.query('selectDocuments');

    //disconnect
    await businessNetworkConnection.disconnect(cardId);

    //return usePointsResults object
    return document;
  }
  catch(err) {
    //print and return error
    console.log("Error getting approveRequestList: "+err);
    var error = {};
    error.error = err.message;
    return error
  }

},



addAccessRequest: async function (cardId, distributorAccNo, docId, retailerAccNo,  docName, requestId)
{
  try {

    //connect as admin
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect('admin@dms-network');

    //get the factory for the business network.
    factory = businessNetworkConnection.getBusinessNetwork().getFactory();

    //create distributor participant
    const authorizeRequest = factory.newResource(namespace, 'AuthorizeRequest', requestId);
    authorizeRequest.requestId = requestId
    authorizeRequest.documentId = docId
    authorizeRequest.docName = docName;
    authorizeRequest.approvalStatus = false;
    authorizeRequest.retailer = factory.newRelationship(namespace, 'Retailer', retailerAccNo);
    authorizeRequest.distributor = factory.newRelationship(namespace, 'Distributor', distributorAccNo);
    //add distributor participant
    const assetRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.AuthorizeRequest');
    await assetRegistry.add(authorizeRequest);


        //disconnect
    await businessNetworkConnection.disconnect('admin@dms-network');

    return true;
  }
  catch(err) {
    //print and return error
    console.log(err);
    var error = {};
    error.error = err.message;
    return error;
  }


},
approveAccessRequest: async function (cardId, retailerAccNo, accessRequestId)
{
  try {

    //connect as admin
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect('admin@dms-network');

    const assetRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.AuthorizeRequest');
    authorizeRequest = await assetRegistry.get(accessRequestId);
    authorizeRequest.approvalStatus = true;

    await assetRegistry.update(authorizeRequest);


        //disconnect
    await businessNetworkConnection.disconnect('admin@dms-network');

    return true;
  }
  catch(err) {
    //print and return error
    console.log(err);
    var error = {};
    error.error = err.message;
    return error;
  }
}
}

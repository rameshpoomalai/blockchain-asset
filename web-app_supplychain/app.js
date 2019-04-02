'use strict';

var util = require('util');
//get libraries
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path')
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const multer   = require('multer');
const uuidv1 = require('uuid/v1');
const fs = require('fs');

//create express web-app
const app = express();
const apiRouter = express.Router()
const uploadRouter = express.Router()


//get the libraries to call
var network = require('./network/network.js');
var validate = require('./network/validate.js');
var analysis = require('./network/analysis.js');

//bootstrap application settings
apiRouter.use(express.static('./public'));
apiRouter.use('/scripts', express.static(path.join(__dirname, '/public/scripts')));

apiRouter.use(compression());
apiRouter.use(bodyParser.json({ limit: '50mb' }));
apiRouter.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
apiRouter.use(cookieParser());
apiRouter.use(helmet());


// additional configurations can be applied on demand, this one mislead the
// caller to think we’re using PHP
apiRouter.use(helmet.hidePoweredBy({
  setTo: 'PHP 4.2.0'
}));


// const ipfsApi = require('ipfs-api');
// const ipfs = new ipfsApi('localhost', '5001', { protocol:'http' });

var upload = multer({ dest: 'uploads/' })



uploadRouter.post('/upload',upload.single('avatar'),   function(req, res) {

res.json(req.file);



  // ipfs.add(files, function(err,resd)  {
  //   console.log("Step 4");
  //   if (err) {
  //
  //     res.json({
  //        error: 'Failed to upload new image'
  //      });
  //   } else {
  //     console.log("Step 5");
  //     let accountNumber = req.body.containerId
  //     let documentPath = `https://ipfs.io/ipfs/${resd[0].hash}`;
  //      res.json({
  //         success: response
  //       });
  //     }
  //   } );

});

  // upload(req,res,function(err) {
  //   if(err) {
  //       return res.end("Error uploading file.");
  //   }
  //   res.end("File is uploaded");
  // });



    // Everything went fine.


//get home page
apiRouter.get('/home', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

//get retailer page
apiRouter.get('/retailer', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/retailer.html'));
});



apiRouter.get('/api/viewfile', function (req, res) {
  console.log("req.query.documentId:"+req.query.documentId);
  network.getDocumentById(req.query.cardId, req.query.documentId)

    .then((document) => {
      //return error if error in response
      if (document.error != null) {
        res.json({
          error: document.error
        });
      } else {
        console.log("document"+document);
        console.log("document.docPath:"+document.docPath);
        var stream = fs.createReadStream(document.docPath);
        var filename = document.originalname;
        // Be careful of special characters

        filename = encodeURIComponent(filename);
        // Ideally this should strip them

        res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
        res.setHeader('Content-type', document.mimetype);
        stream.pipe(res);

      }

    });
});



//get retailer registration page
apiRouter.get('/registerRetailer', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/registerRetailer.html'));
});

//get distributor page
apiRouter.get('/distributor', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/distributor.html'));
});

//get distributor registration page
apiRouter.get('/registerDistributor', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/registerDistributor.html'));
});

//get distributor page
apiRouter.get('/manufacture', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/manufacture.html'));
});

//get distributor registration page
apiRouter.get('/registerManufacture', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/registerManufacture.html'));
});

//get about page
apiRouter.get('/about', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/about.html'));
});

function addDocument(req, res)
{
  //declare variables to retrieve from request
  var accountNumber = req.body.accountnumber;
  var cardId = req.body.cardid;
  var docName = req.body.docName;
  var docDesc = req.body.docDesc;
  var originalname = req.body.originalname;
  var mimetype = req.body.mimetype;
  var path =  req.body.path;
  var size = req.body.size

  var returnData = {};
  //print variables
  console.log('Using param - docName: ' + docName + ' docDesc: ' + docDesc + ' accountNumber: ' + accountNumber + ' cardId: ' + cardId);

  //validate retailer registration fields
  validate.validateDocumentDetails(cardId, accountNumber, docName, docDesc)
    .then((response) => {
      //return error if error in response
      if (response.error != null) {
        res.json({
          error: response.error
        });
        return;
      } else {

        //else register retailer on the network
        network.addDocument(cardId, accountNumber, docName, docDesc, uuidv1(), path, originalname, mimetype, size)
          .then((response) => {
            //return error if error in response
            if (response.error != null) {
              res.json({
                error: response.error
              });
            } else {

                //get UsePoints transactions from the network
                console.log('documentList using param - ' + ' accountNumber: ' + accountNumber + ' cardId: ' + cardId);
                //network.documentList(cardId, accountNumber )

                network.selectDocumentByRetailer(cardId,accountNumber)
                  .then((documentsData) => {
                    //return error if error in response
                    console.log("documentsData:"+documentsData);
                    if (documentsData.error != null) {
                      res.json({
                        error: documentsData.error
                      });
                      return;
                    } else {
                      //else add transaction data to return object
                      returnData.documentsData = documentsData;
                      res.json(returnData);
                    }


                  })

            }
          });
      }
    });
}

//post call to register retailer on the network
apiRouter.post('/api/addDocument', function(req, res) {
  addDocument(req, res);
});

//post call to register retailer on the network
apiRouter.post('/api/approveDocument', function(req, res) {

  //declare variables to retrieve from request
  var accountNumber = req.body.manufactureid;
  var cardId = req.body.cardid;
  var docId = req.body.documentId;
  var returnData = {};
  //print variables
  console.log('approveDocument Using param - docId: ' + docId );

  //validate retailer registration fields
  validate.validateDocumentId(cardId, accountNumber, docId)
    .then((response) => {
      //return error if error in response
      if (response.error != null) {
        res.json({
          error: response.error
        });
        return;
      } else {

        //else register retailer on the network
        network.approveDocument(cardId, docId)
        .then(() => {
          //get UsePoints transactions from the network

            network.selectDocumentsApproved(cardId)
              .then((approvedDocs) => {
                console.log("selectDocumentsApproved>>>>>>"+approvedDocs)
                //return error if error in response
                if (approvedDocs.error != null) {
                  res.json({
                    error: approvedDocs.error
                  });
                } else {
                  //else add transaction data to return object
                  returnData.approvedDocs = approvedDocs;
                  //add total points given by distributor to return object

                  //get UsePoints transactions from the network
                  console.log('documentList using param - ' + ' accountNumber: ' + accountNumber + ' cardId: ' + cardId);
                  //network.documentList(cardId, accountNumber )
                  //Load the approval pending list
                  network.selectDocumentsApprovalPending(cardId)
                    .then((approvalPendingList) => {

                      //return error if error in response
                      if (approvalPendingList.error != null) {
                        res.json({
                          error: approvalPendingList.error
                        });
                      } else {
                        //else add transaction data to return object
                        returnData.approvalPendingList = approvalPendingList;
                        //add total points given by distributor to return object

                      }

                      //return returnData
                      res.json(returnData);

                    });


                }
              });

        })

      }
    });


});

//post call to register retailer on the network
apiRouter.post('/api/registerRetailer', function(req, res) {

  //declare variables to retrieve from request
  var accountNumber = req.body.accountnumber;
  var cardId = req.body.cardid;
  var firstName = req.body.firstname;
  var lastName = req.body.lastname;
  var email = req.body.email;
  var phoneNumber = req.body.phonenumber;

  //print variables
  console.log('Using param - firstname: ' + firstName + ' lastname: ' + lastName + ' email: ' + email + ' phonenumber: ' + phoneNumber + ' accountNumber: ' + accountNumber + ' cardId: ' + cardId);

  //validate retailer registration fields
  validate.validateRetailerRegistration(cardId, accountNumber, firstName, lastName, email, phoneNumber)
    .then((response) => {
      //return error if error in response
      if (response.error != null) {
        res.json({
          error: response.error
        });
        return;
      } else {
        //else register retailer on the network
        network.registerRetailer(cardId, accountNumber, firstName, lastName, email, phoneNumber)
          .then((response) => {
            //return error if error in response
            if (response.error != null) {
              res.json({
                error: response.error
              });
            } else {
              //else return success
              res.json({
                success: response
              });
            }
          });
      }
    });


});

//post call to register distributor on the network
apiRouter.post('/api/registerDistributor', function(req, res) {

  //declare variables to retrieve from request
  var name = req.body.name;
  var distributorId = req.body.distributorid;
  var cardId = req.body.cardid;

  //print variables
  console.log('Using param - name: ' + name + ' distributorId: ' + distributorId + ' cardId: ' + cardId);

  //validate distributor registration fields
  validate.validateDistributorRegistration(cardId, distributorId, name)
    .then((response) => {
      //return error if error in response
      if (response.error != null) {
        res.json({
          error: response.error
        });
        return;
      } else {
        //else register distributor on the network
        network.registerDistributor(cardId, distributorId, name)
          .then((response) => {
            //return error if error in response
            if (response.error != null) {
              res.json({
                error: response.error
              });
            } else {
              //else return success
              res.json({
                success: response
              });
            }
          });
      }
    });

});




//post call to retrieve retailer data, transactions data and distributors to perform transactions with from the network
apiRouter.post('/api/retailerData', function(req, res) {

  //declare variables to retrieve from request
  var accountNumber = req.body.accountnumber;
  var cardId = req.body.cardid;

  //print variables
  console.log('retailerData using param - ' + ' accountNumber: ' + accountNumber + ' cardId: ' + cardId);

  //declare return object
  var returnData = {};

  //get retailer data from network
  network.retailerData(cardId, accountNumber)
    .then((retailer) => {
      //return error if error in response
      if (retailer.error != null) {
        res.json({
          error: retailer.error
        });
        return;
      } else {
        //else add retailer data to return object
        returnData.accountNumber = retailer.accountNumber;
        returnData.firstName = retailer.firstName;
        returnData.lastName = retailer.lastName;
        returnData.phoneNumber = retailer.phoneNumber;
        returnData.email = retailer.email;
        returnData.points = retailer.points;
        console.log('documentList using param - ' + ' accountNumber: ' + accountNumber + ' cardId: ' + cardId);
        network.documentList(cardId, accountNumber )
          .then((documentsData) => {
            //return error if error in response
            console.log("documentsData:"+documentsData);
            if (documentsData.error != null) {
              res.json({
                error: documentsData.error
              });
              return;
            } else {
              //else add transaction data to return object
              returnData.documentsData = documentsData;
              console.log('authorizeRequestList using param - ' + ' accountNumber: ' + accountNumber + ' cardId: ' + cardId);
              network.authorizeRequestListByRetailer(cardId, accountNumber)
                .then((authorizeRequestList) => {
                  console.log("authorizeRequestList:"+authorizeRequestList);
                  //return error if error in response
                  if (authorizeRequestList.error != null) {
                    res.json({
                      error: authorizeRequestList.error
                    });
                    return;
                  }
                  else {
                    //else return success
                    returnData.approveRequestList = authorizeRequestList;
                    res.json(returnData);
                  }

                })

            }

          })


      }

    })

});

//post call to retrieve distributor data and transactions data from the network
apiRouter.post('/api/distributorData', function(req, res) {

  //declare variables to retrieve from request
  var distributorId = req.body.distributorid;
  var cardId = req.body.cardid;

  //print variables
  console.log('distributorData using param - ' + ' distributorId: ' + distributorId + ' cardId: ' + cardId);

  //declare return object
  var returnData = {};

  //get distributor data from network
  network.distributorData(cardId, distributorId)
    .then((distributor) => {
      //return error if error in response
      if (distributor.error != null) {
        res.json({
          error: distributor.error
        });
      } else {
        //else add distributor data to return object
        returnData.id = distributor.id;
        returnData.name = distributor.name;

          //get EarnPoints transactions from the network
          console.log('authorizeRequestList using param - ' + ' distributorId: ' + distributorId + ' cardId: ' + cardId);
          network.authorizeRequestListByDistributor(cardId, distributorId)
            .then((authorizeRequestList) => {
              console.log("requestedDocumentsPending:"+authorizeRequestList);
              //return error if error in response
              if (authorizeRequestList.error != null) {
                res.json({
                  error: authorizeRequestList.error
                });
                return;
              }
              else {
                //else return success
                returnData.authorizeRequestList = authorizeRequestList;
                network.allRetailersInfo(cardId)
                  .then((allRetailers) => {
                    console.log("allRetailers:"+allRetailers);
                    //return error if error in response
                    if (allRetailers.error != null) {
                      res.json({
                        error: allRetailers.error
                      });
                      return;
                    }
                    else {
                      //else return success
                      returnData.allRetailers = allRetailers;
                      res.json(returnData);
                    }

                  })

                //res.json(returnData);
              }

            })

      }
    })
});

//post call to retrieve distributor data and transactions data from the network
apiRouter.post('/api/selectRetailers', function(req, res) {

  //declare variables to retrieve from request
  var distributorId = req.body.distributorid;
  var cardId = req.body.cardid;

  //print variables
  console.log('distributorData using param - ' + ' distributorId: ' + distributorId + ' cardId: ' + cardId);

  //declare return object
  var returnData = {};

  //get distributor data from network
  network.selectRetailers(cardId, distributorId)
    .then((retailer) => {
      //return error if error in response
      if (retailers.error != null) {
        res.json({
          error: retailers.error
        });
      } else {
        //else add distributor data to return object
        returnData.retailers = retailers;

      }
      //return returnData
      res.json(returnData);
    });


});


apiRouter.post('/api/selectApprovedDocumentByRetailer', function(req, res) {

  //declare variables to retrieve from request
  var retailerId = req.body.accountNo;
  var cardId = req.body.cardid;

  //print variables
  console.log('selectApprovedDocumentByRetailer using param - ' + ' retailerId: ' + retailerId + ' cardId: ' + cardId);

  //declare return object
  var returnData = {};

  //get distributor data from network
  //network.selectApprovedDocumentByRetailer(cardId, retailerId) TODO
  network.selectApprovedDocumentByRetailer(cardId, retailerId)

    .then((documents) => {
      //return error if error in response
      if (documents.error != null) {
        res.json({
          error: document.error
        });
      } else {
        //else add distributor data to return object
        console.log("selectApprovedDocumentByRetailer:"+documents);
        returnData.documentsData = documents;
      }
      //return returnData
      res.json(returnData);
    });


});
//post call to retrieve distributor data and transactions data from the network
apiRouter.post('/api/selectDocumentByRetailer', function(req, res) {

  //declare variables to retrieve from request
  var retailerId = req.body.accountNo;
  var cardId = req.body.cardid;

  //print variables
  console.log('selectDocumentByRetailer using param - ' + ' retailerId: ' + retailerId + ' cardId: ' + cardId);

  //declare return object
  var returnData = {};

  //get distributor data from network
  network.selectDocumentByRetailer(cardId, retailerId)
    .then((documents) => {
      //return error if error in response
      if (documents.error != null) {
        res.json({
          error: document.error
        });
      } else {
        //else add distributor data to return object
        returnData.documentsData = documents;
      }
      //return returnData
      res.json(returnData);
    });


});
apiRouter.post('/api/registerManufacture', function(req, res) {

  //declare variables to retrieve from request
  var name = req.body.name;
  var manufactureId = req.body.manufactureid;
  var cardId = req.body.cardid;

  //print variables
  console.log('Using param - name: ' + name + ' manufactureId: ' + manufactureId + ' cardId: ' + cardId);

  //validate distributor registration fields
  validate.validateManufactureRegistration(cardId, manufactureId, name)
    .then((response) => {
      //return error if error in response
      if (response.error != null) {
        res.json({
          error: response.error
        });
        return;
      } else {
        //else register distributor on the network
        network.registerManufacture(cardId, manufactureId, name)
          .then((response) => {
            //return error if error in response
            if (response.error != null) {
              res.json({
                error: response.error
              });
            } else {
              //else return success
              res.json({
                success: response
              });
            }
          });
      }
    });

});

//post call to retrieve distributor data and transactions data from the network
apiRouter.post('/api/manufactureData', function(req, res) {

  //declare variables to retrieve from request
  var manufactureId = req.body.manufactureid;
  var cardId = req.body.cardid;

  //print variables
  console.log('manufactureData using param - ' + ' manufactureId: ' + manufactureId + ' cardId: ' + cardId);

  //declare return object
  var returnData = {};

  //get distributor data from network
  network.manufactureData(cardId, manufactureId)
    .then((manufacture) => {
      console.log("Getting the manufacture Data"+manufacture);
      //return error if error in response
      if (manufacture.error != null) {
        res.json({
          error: manufacture.error
        });
      } else {
        //else add distributor data to return object
        returnData.id = manufacture.id;
        returnData.name = manufacture.name;
        network.selectDocumentsApproved(cardId)
          .then((approvedDocs) => {
            console.log("selectDocumentsApproved>>>>>>"+approvedDocs)
            //return error if error in response
            if (approvedDocs.error != null) {
              res.json({
                error: approvedDocs.error
              });
            } else {
              //else add transaction data to return object
              returnData.approvedDocs = approvedDocs;
              //add total points given by distributor to return object
              network.selectDocumentsApprovalPending(cardId)
                .then((approvalPendingList) => {

                  //return error if error in response
                  if (approvalPendingList.error != null) {
                    res.json({
                      error: approvalPendingList.error
                    });
                  } else {
                    //else add transaction data to return object
                    returnData.approvalPendingList = approvalPendingList;
                    //add total points given by distributor to return object

                  }

                  //return returnData
                  res.json(returnData);

                });


            }
          });

      }

    })
});


//post call to register retailer on the network
apiRouter.post('/api/requestAccess', function(req, res) {

  //declare variables to retrieve from request
  var distributorAccNumber = req.body.accountnumber;
  var cardId = req.body.cardid;
  var docId = req.body.documentId;
  var docName = req.body.docName;
  var retailerAccNumber = req.body.retailer;
  var returnData = {};
  //print variables
  console.log('requestAccess Using param - docId: ' + docId +"DocName:" +docName);


  //validate retailer registration fields
  validate.validateAccessRequest(cardId, distributorAccNumber, docId, retailerAccNumber)
    .then((response) => {
      //return error if error in response
      if (response.error != null) {
        res.json({
          error: response.error
        });
        return;
      } else {

        //else register retailer on the network
        network.addAccessRequest(cardId, distributorAccNumber, docId, retailerAccNumber,docName, uuidv1() )
        .then(() => {
          //get UsePoints transactions from the network
            console.log("distributorAccNumber:"+distributorAccNumber)
            console.log("cardId:"+cardId)
            network.authorizeRequestListByDistributor(cardId, distributorAccNumber)
              .then((authorizeRequestList) => {
                console.log("authorizeRequestList>>>>>>:"+authorizeRequestList)
                //return error if error in response
                if (authorizeRequestList.error != null) {
                  res.json({
                    error: authorizeRequestList.error
                  });
                } else {
                  //else add transaction data to return object
                  returnData.authorizeRequestList = authorizeRequestList;
                  //add total points given by distributor to return object
                  res.json(returnData);
                }
              });

          });

    }

});
});



//post call to register retailer on the network
apiRouter.post('/api/approveAccessRequest', function(req, res) {

  //declare variables to retrieve from request
  var retailerAccNo = req.body.accountNo;
  var cardId = req.body.cardid;
  var accessRequestId = req.body.accessRequestId;

  var returnData = {};
  //print variables
  console.log('approveAccessRequest Using param - accessRequestId: ' + accessRequestId +" retailerAccNo:"+retailerAccNo+" cardId:"+cardId);


  //validate retailer registration fields
  validate.validateApproveAccessRequest(cardId, retailerAccNo, accessRequestId)
    .then((response) => {
      //return error if error in response
      if (response.error != null) {
        res.json({
          error: response.error
        });
        return;
      } else {

        //else register retailer on the network
        network.approveAccessRequest(cardId, retailerAccNo, accessRequestId)
        .then(() => {
          //get UsePoints transactions from the network
            console.log("distributorAccNumber:"+retailerAccNo)
            console.log("cardId:"+cardId)
            network.authorizeRequestListByRetailer(cardId, retailerAccNo)
              .then((authorizeRequestList) => {
                console.log("authorizeRequestList:"+authorizeRequestList);
                //return error if error in response
                if (authorizeRequestList.error != null) {
                  res.json({
                    error: authorizeRequestList.error
                  });
                  return;
                }
                else {
                  //else return success
                  returnData.approveRequestList = authorizeRequestList;
                  res.json(returnData);
                }

              })

          });

    }

  });
});
//declare port
var port = process.env.PORT || 8000;
if (process.env.VCAP_APPLICATION) {
  port = process.env.PORT;
}

app.use('/', apiRouter);
app.use('/uploads', uploadRouter);

//run app on port
app.listen(port, function() {
  console.log('app running on port: %d', port);
});

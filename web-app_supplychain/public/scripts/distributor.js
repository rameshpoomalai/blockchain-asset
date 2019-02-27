var apiUrl = location.protocol + '//' + location.host + "/api/";

//check user input and call server
$('.sign-in-distributor').click(function() {

  //get user input data
  var formDistributorId = $('.distributor-id input').val();
  var formCardId = $('.card-id input').val();

  //create json data
  var inputData = '{' + '"distributorid" : "' + formDistributorId + '", ' + '"cardid" : "' + formCardId + '"}';
  console.log(inputData);

  //make ajax call
  $.ajax({
    type: 'POST',
    url: apiUrl + 'distributorData',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //display loading
      document.getElementById('loader').style.display = "block";
    },
    success: function(data) {

      //remove loader
      document.getElementById('loader').style.display = "none";

      //check data for error
      if (data.error) {
        alert(data.error);
        return;
      } else {

        //update heading
        $('.heading').html(function() {
          var str = '<h2><b> ' + data.name + ' </b></h2>';
          str = str + '<h2><b> ' + data.id + ' </b></h2>';

          return str;
        });


        $('.documentApprovedList').html(function() {

            var str = '<table  width="100%"  class="blueTable documentList" border="1" cellspacing="1" cellpadding="4"><tr><th>Retailer</th><th width="50%">Document Name </th><th width="50%">Document Status </th></tr>';
            var documentsData = data.authorizeRequestList;
            if(documentsData)
            {
              for (var i = 0; i < documentsData.length; i++) {

                if(documentsData[i].approvalStatus==true)
                {
                    
                    str = str + '<tr><td width="50%">' + documentsData[i].retailer + '</td><td width="50%"> <a href=/api/viewfile?documentId='+documentsData[i].documentId +'&cardId='+formCardId +'&distributorId='+formDistributorId+' target=”_blank” >' + documentsData[i].docName + '</a></td><td width="50%"> ' + documentsData[i].approvalStatus + '</td></tr>';
                }

              }
            }

            str = str + '</table>'
            return str;
        });

        //update dashboard
        $('.documentPendingList').html(function() {

            var str = '<table width="100%"  class="blueTable documentList" border="1" cellspacing="1" cellpadding="4"><tr><th>Retailer</th><th width="50%">Document Name </th><th width="50%">Document Status </th></tr>';
            var documentsData = data.authorizeRequestList;
            if(documentsData)
            {
              for (var i = 0; i < documentsData.length; i++) {

                if(documentsData[i].approvalStatus==false)
                {
                    str = str + '<tr><td width="50%">' + documentsData[i].retailer + '</td><td width="50%">' + documentsData[i].docName + '</td><td width="50%"> ' + documentsData[i].approvalStatus + '</td></tr>';
                }
              }
            }

            str = str + '</table>'
            return str;
        });
        //update dashboard
        $('.selectRetailer').html(function() {
            var str = '';
            var documentsData = data.allRetailers;
            if(documentsData)
            {
              str = str + '<option value="0">--------------Select---------------</option>';
              for (var i = 0; i < documentsData.length; i++) {
                str = str + '<option value="' + documentsData[i].accountNumber + '">' + documentsData[i].firstName +' '+ documentsData[i].lastName+'</option>';
              }
            }
            return str;

        });

        //remove login section
        document.getElementById('loginSection').style.display = "none";
        //display transaction section
        document.getElementById('transactionSection').style.display = "block";
      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      //reload on error
      alert("Error: Try again")
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);

      location.reload();
    }
  });

});
$('select.selectRetailer').change( function() {

  //get user input data
  var formDistributorId = $('.distributor-id input').val();
  var formCardId = $('.card-id input').val();
  var retailerAccountNo = $(this).children("option:selected").val();
  if(retailerAccountNo=="0")
  {
    return
  }

  //create json data
  var inputData = '{' + '"distributorid" : "' + formDistributorId + '", ' + '"cardid" : "' + formCardId + '","accountNo": "'+retailerAccountNo+'"}';
  console.log(inputData);

  //make ajax call
  $.ajax({
    type: 'POST',
    url: apiUrl + 'selectApprovedDocumentByRetailer',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //display loading
      document.getElementById('loader').style.display = "block";
    },
    success: function(data) {

      //remove loader
      document.getElementById('loader').style.display = "none";

      //check data for error
      if (data.error) {
        alert(data.error);
        return;
      } else {

        //update dashboard
        $('.selectDocument').html(function() {
            var str = '<option value="0">--------------Select---------------</option>';
            var documentsData = data.documentsData;
            if(documentsData)
            {
              for (var i = 0; i < documentsData.length; i++) {

                str = str + '<option value="' + documentsData[i].documentId + '">' + documentsData[i].docName +'</option>';
              }
            }
            return str;

        });

        //remove login section
        document.getElementById('loginSection').style.display = "none";
        //display transaction section
        document.getElementById('transactionSection').style.display = "block";
      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      //reload on error
      alert("Error: Try again")
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);

      location.reload();
    }
  });
});


$('.add-document-access-request-asset').click(function() {
  requestAccess();
});


//VIEW File





function requestAccess() {

  //get user input data/

  var retailerAccountNo = $('.selectRetailer'  ).children("option:selected").val();
  var documentId =      $('.selectDocument').children("option:selected").val();
  var formAccountNum = $('.distributor-id input').val();
  var formCardId = $('.card-id input').val();
  var docName = $('.selectDocument').children("option:selected").text();


  if(documentId)
  {
    //placeholder for validation check
    if((documentId =="--------------Select---------------") )
    {
      alert("Select valid document!!!!!!!!!!!!");
      return
    }
  }
  else {
    alert("Select valid document!!!!!!");
    return
  }

  if(retailerAccountNo)
  {
    //placeholder for validation check
    if((retailerAccountNo =="--------------Select---------------") )
    {
      alert("Select valid retailer!!!!!!!!!!!!");
      return
    }
  }
  else {
    alert("Select valid retailer!!!!!!");
    return
  }


  //create json data
  var inputData = '{' + '"accountnumber" : "' + formAccountNum + '", "cardid" : "'
  + formCardId  + '", "retailer" : "'  + retailerAccountNo  + '", "docName" : "'  + docName
  + '", "documentId" : "' + documentId +  '"}';
  console.log(inputData)

  //make ajax call
  $.ajax({
    type: 'POST',
    url: apiUrl + 'requestAccess',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //display loading
      document.getElementById('loader').style.display = "block";
    },
    success: function(data) {

      //remove loader


      //check data for error
      if (data.error) {
        alert(data.error);
        return;
      } else {


        //update dashboard
        $('.documentApprovedList').html(function() {

            var str = '<table width="100%"  class="blueTable documentList" border="1" cellspacing="1" cellpadding="4"><tr><th>Retailer</th><th width="50%">Document Name </th><th width="50%">Document Status </th></tr>';
            var documentsData = data.authorizeRequestList;
            if(documentsData)
            {
              for (var i = 0; i < documentsData.length; i++) {

                if(documentsData[i].approvalStatus==true)
                {
                    str = str + '<tr><td width="50%">' + documentsData[i].retailer + '</td><td width="50%">' + documentsData[i].docName + '</td><td width="50%"> ' + documentsData[i].approvalStatus + '</td></tr>';
                }

              }
            }

            str = str + '</table>'
            return str;
        });

        //update dashboard
        $('.documentPendingList').html(function() {

            var str = '<table width="100%"  class="blueTable documentList" border="1" cellspacing="1" cellpadding="4"><tr><th>Retailer</th><th width="50%">Document Name </th><th width="50%">Document Status </th></tr>';
            var documentsData = data.authorizeRequestList;
            if(documentsData)
            {
              for (var i = 0; i < documentsData.length; i++) {

                if(documentsData[i].approvalStatus==false)
                {
                    str = str + '<tr><td width="50%">' + documentsData[i].retailer + '</td><td width="50%">' + documentsData[i].docName + '</td><td width="50%"> ' + documentsData[i].approvalStatus + '</td></tr>';
                }
              }
            }

            str = str + '</table>'
            return str;
        });




        //remove login section and display retailer page
        document.getElementById('loginSection').style.display = "none";
        document.getElementById('transactionSection').style.display = "block";
        $('.document-name input').val("");
        $('.document-desc input').val("");

      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      //reload on error
      alert("Error: Try again")
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
    },
    complete: function() {
      document.getElementById('loader').style.display = "none";
      $('.selectRetailer').val("");
      $('.selectDocument').val("");

    }
  });
}

var apiUrl = location.protocol + '//' + location.host + "/api/";

//check user input and call server
$('.sign-in-member').click(function() {
  updateMember();
});


function updateMember() {

  //get user input data
  var formAccountNum = $('.account-number input').val();
  var formCardId = $('.card-id input').val();

  //create json data
  var inputData = '{' + '"accountnumber" : "' + formAccountNum + '", ' + '"cardid" : "' + formCardId + '"}';
  console.log(inputData)

  //make ajax call
  $.ajax({
    type: 'POST',
    url: apiUrl + 'memberData',
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
          var str = '<h2><b>' + data.firstName + ' ' + data.lastName + '</b></h2>';
          str = str + '<h2><b>' + data.accountNumber + '</b></h2>';


          return str;
        });

        //update partners dropdown for earn points transaction
        $('.documentList').html(function() {
          var str = '<tr><th width="50%">Document Name </th><th width="50%">Document Status </th></tr>';
          var documentsData = data.documentsData;
          if(documentsData)
          {
            for (var i = 0; i < documentsData.length; i++) {

              str = str + '<tr><td width="50%"> <a href=/api/viewfile?documentId='+documentsData[i].documentId +'&cardId='+formCardId +'&partnerId='+formAccountNum+' target=”_blank” >' + documentsData[i].docName + ' </a></td><td width="50%"> ' + documentsData[i].docStatus + '</td></tr>';
            }
          }

          return str;
        });


        //update partners dropdown for use points transaction
        $('.approveRequestList').html(function() {
          var str = '<tr><th width="30%">Document Name</th><th width="30%">Requesting Partner</th><th width="30%">action</th></tr>';
          var approveRequestList = data.approveRequestList;
          if(approveRequestList)
          {
            for (var i = 0; i < approveRequestList.length; i++) {

              if(approveRequestList[i].approvalStatus=='approved' || approveRequestList[i].approvalStatus=='declined')
              {
                str = str + '<tr><td width="30%">' + approveRequestList[i].docName + '</td><td width="30%"> ' + approveRequestList[i].partner + '</td> <td width="30%"> '+approveRequestList[i].approvalStatus+' </td>  </tr>';
              }
              else {
                str = str + '<tr><td width="30%">' + approveRequestList[i].docName + '</td><td width="30%"> ' + approveRequestList[i].partner + '</td> <td width="30%"> <a><img  width="25" height="25" src="./img/approveicon.png"  onclick="return approveAcessRequest(\''+approveRequestList[i].requestId+'\');"></img><img  width="25" height="25" src="./img/rejecticon.png"  onclick="return declineAcessRequest(\''+approveRequestList[i].requestId+'\');"></img></a> </td>  </tr>';
              }
            }
          }

          return str;
        });


        //remove login section and display member page
        document.getElementById('loginSection').style.display = "none";
        document.getElementById('transactionSection').style.display = "block";
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

    }
  });
}



 $('.add-documents').click(function() {
   addDocument();
 });



function addDocument() {

  //get user input data
  var documentName = $('.document-name input').val();
  var documentDescription = $('.document-desc input').val();
  var documentContent = $('.document-content input').val();
  var formAccountNum = $('.account-number input').val();
  var formCardId = $('.card-id input').val();
  var documentdetails= $('.upload').val();

  documentdetails = documentdetails.substring(6, documentdetails.length-7 )



  //create json data
  var inputData = '{' + '"accountnumber" : "' + formAccountNum + '", ' + '"cardid" : "'
  + formCardId  + '", "docName" : "' + documentName + '", "docDesc" : "' + documentDescription
  + '", '+documentdetails+'}';
  console.log(inputData)

  //make ajax call
  $.ajax({
    type: 'POST',
    url: apiUrl + 'addDocument',
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



        //update partners dropdown for earn points transaction
        $('.documentList').html(function() {
          var str = '<tr><th width="50%">Document Name</th><th width="50%">Document Status</th></tr>';
          var documentsData = data.documentsData;
          if(documentsData)
          {
            for (var i = 0; i < documentsData.length; i++) {

              str = str + '<tr><td width="50%">' + documentsData[i].docName + '</td><td width="50%"> ' + documentsData[i].docStatus + '</td></tr>';
            }
          }

          return str;
        });


        //remove login section and display member page
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

    }
  });
}

function approveAcessRequest(requestId)
{

    //get user input data
    var formAccountNum = $('.account-number input').val();
    var formCardId = $('.card-id input').val();

    //create json data
    var inputData = '{' + '"accountNo" : "' + formAccountNum + '", ' + '"cardid" : "' + formCardId + '", "accessRequestId" :"'+requestId+'"}';
    console.log(inputData);

    //make ajax call
    $.ajax({
      type: 'POST',
      url: apiUrl + 'approveAccessRequest',
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
          //update partners dropdown for use points transaction
          $('.approveRequestList').html(function() {
            var str = '<tr><th width="30%">Document Name</th><th width="30%">Requesting Partner</th><th width="30%">Action</th></tr>';
            var approveRequestList = data.approveRequestList;
            if(approveRequestList)
            {
              for (var i = 0; i < approveRequestList.length; i++) {

                if(approveRequestList[i].approvalStatus=='approved' || approveRequestList[i].approvalStatus=='declined')
                {
                str = str + '<tr><td width="30%">' + approveRequestList[i].docName + '</td><td width="30%"> ' + approveRequestList[i].partner + '</td> <td width="30%"> '+approveRequestList[i].approvalStatus+' </td>  </tr>';
                }
                else {
                  str = str + '<tr><td width="30%">' + approveRequestList[i].docName + '</td><td width="30%"> ' + approveRequestList[i].partner + '</td> <td width="30%"> <a><img  width="25" height="25" src="./img/approveicon.png"  onclick="return approveAcessRequest(\''+approveRequestList[i].requestId+'\');"></img><img  width="25" height="25" src="./img/rejecticon.png"  onclick="return declineAcessRequest(\''+approveRequestList[i].requestId+'\');"></img></a> </td>  </tr>';
                }

              }
            }

            return str;
          });

        }

      },
      error: function(jqXHR, textStatus, errorThrown) {
        //reload on error
        alert("Error: Try again")
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
        document.getElementById('loader').style.display = "none";
        location.reload();
      }
    });
}

function declineAcessRequest(requestId)
{

    //get user input data
    var formAccountNum = $('.account-number input').val();
    var formCardId = $('.card-id input').val();

    //create json data
    var inputData = '{' + '"accountNo" : "' + formAccountNum + '", ' + '"cardid" : "' + formCardId + '", "accessRequestId" :"'+requestId+'"}';
    console.log(inputData);

    //make ajax call
    $.ajax({
      type: 'POST',
      url: apiUrl + 'declineAcessRequest',
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
          //update partners dropdown for use points transaction
          $('.approveRequestList').html(function() {
            var str = '<tr><th width="30%">Document Name</th><th width="30%">Requesting Partner</th><th width="30%">Action</th></tr>';
            var approveRequestList = data.approveRequestList;
            if(approveRequestList)
            {
              for (var i = 0; i < approveRequestList.length; i++) {

                if(approveRequestList[i].approvalStatus=='approved' || approveRequestList[i].approvalStatus=='declined')
                {
                str = str + '<tr><td width="30%">' + approveRequestList[i].docName + '</td><td width="30%"> ' + approveRequestList[i].partner + '</td> <td width="30%"> '+approveRequestList[i].approvalStatus+' </td>  </tr>';
                }
                else {
                  str = str + '<tr><td width="30%">' + approveRequestList[i].docName + '</td><td width="30%"> ' + approveRequestList[i].partner + '</td> <td width="30%"> <a><img  width="25" height="25" src="./img/approveicon.png"  onclick="return approveAcessRequest(\''+approveRequestList[i].requestId+'\');"></img><img  width="25" height="25" src="./img/rejecticon.png"  onclick="return declineAcessRequest(\''+approveRequestList[i].requestId+'\');"></img></a> </td>  </tr>';
                }

              }
            }

            return str;
          });

        }

      },
      error: function(jqXHR, textStatus, errorThrown) {
        //reload on error
        alert("Error: Try again")
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
        document.getElementById('loader').style.display = "none";
        location.reload();
      }
    });
}

function fileUpload(form, action_url, div_id) {
    // Create the iframe...
    var iframe = document.createElement("iframe");
    iframe.setAttribute("id", "upload_iframe");
    iframe.setAttribute("name", "upload_iframe");
    iframe.setAttribute("width", "0");
    iframe.setAttribute("height", "0");
    iframe.setAttribute("border", "0");
    iframe.setAttribute("style", "width: 0; height: 0; border: none;");

    // Add to document...
    form.parentNode.appendChild(iframe);
    window.frames['upload_iframe'].name = "upload_iframe";

    iframeId = document.getElementById("upload_iframe");

    // Add event...
    var eventHandler = function () {

            if (iframeId.detachEvent) iframeId.detachEvent("onload", eventHandler);
            else iframeId.removeEventListener("load", eventHandler, false);

            // Message from server...

            if (iframeId.contentDocument) {
                content = iframeId.contentDocument.body.innerHTML;
            } else if (iframeId.contentWindow) {
                content = iframeId.contentWindow.document.body.innerHTML;
            } else if (iframeId.document) {
                content = iframeId.document.body.innerHTML;
            }

            document.getElementById(div_id).value = content;

            // Del the iframe...
            setTimeout('iframeId.parentNode.removeChild(iframeId)', 250);
        }

    if (iframeId.addEventListener) iframeId.addEventListener("load", eventHandler, true);
    if (iframeId.attachEvent) iframeId.attachEvent("onload", eventHandler);

    // Set properties of form...
    form.setAttribute("target", "upload_iframe");
    form.setAttribute("action", action_url);
    form.setAttribute("method", "post");
    form.setAttribute("enctype", "multipart/form-data");
    form.setAttribute("encoding", "multipart/form-data");

    // Submit the form...
    form.submit();



}

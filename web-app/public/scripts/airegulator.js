var apiUrl = location.protocol + '//' + location.host + "/api/";

//check user input and call server
$('.sign-in-regulator').click(function() {

  //get user input data
  var formregulatorId = $('.regulator-id input').val();
  var formCardId = $('.card-id input').val();

  //create json data
  var inputData = '{' + '"regulatorid" : "' + formregulatorId + '", ' + '"cardid" : "' + formCardId + '"}';
  console.log(inputData);

  //make ajax call
  $.ajax({
    type: 'POST',
    url: apiUrl + 'airegulatorData',
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
        //update dashboard
        $('.dashboards').html(function() {

            var str = '<table width="100%"  class="blueTable  documentList" border="1" cellspacing="1" cellpadding="4"><tr><th>Member</th><th>Document Name </th><th>ML-Prediction</th></tr>';
            var documentsData = data.approvedDocs;
            if(documentsData.length>0)
            {
              for (var i = 0; i < documentsData.length; i++) {
  
                str = str + '<tr><td width="50%">' + documentsData[i].owner + '</td><td width="50%">' + documentsData[i].docName + '</td><td width="50%"> ' + documentsData[i].docAIApprovalStatus + '</td></tr>';
              }
            }

            str = str + '</table>'
            return str;
        });

        $('.reviewandapprove').html(function() {
            var str = '<table width="100%"  class="blueTable  documentList" border="1" cellspacing="1" cellpadding="4"><tr><th>Member</th> <th>Document Name </th><th>ML-Prediction</th></tr>';
            var documentsData = data.approvalPendingList;
            if(documentsData)
            {
              for (var i = 0; i < documentsData.length; i++) {
                var doc_id=documentsData[i].documentId;
                    str = str + '<tr><td>' + documentsData[i].owner + '</td><td > <a href=/api/viewfile?documentId='+documentsData[i].documentId +'&cardId='+formCardId +'&partnerId='+formregulatorId+' target=”_blank” >' + documentsData[i].docName +'</a></td><td>'+documentsData[i].docAIApprovalStatus+'</td></tr>';
              }
            }

            str = str + '</table>';
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
      document.getElementById('loader').style.display = "none";
      location.reload();
    }
  });

});
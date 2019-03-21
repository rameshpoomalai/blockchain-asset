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
        var allairegulators = data.allairegulatorsList;
        //update dashboard
        $('.dashboards').html(function() {

            var str = '<table width="100%"  class="blueTable  documentList" border="1" cellspacing="1" cellpadding="4"><tr><th>Member</th><th>Document Name </th><th>Current Status </th><th>Action</th><th>ML-Option</th><th>ML-Prediction</th></tr>';
            var documentsData = data.approvedDocs;
            if(documentsData.length>0)
            {
              for (var i = 0; i < documentsData.length; i++) {
                var select_airegulator_options = '<select id="selectregulatorids_'+documentsData[i].documentId+'" onchange="callML(\''+documentsData[i].documentId+'\',\''+formCardId+'\');"><option value="select">select</option>"';
                if(allairegulators.length>0)
                {
                    for(var j=0; j<allairegulators.length;j++)
                    {
                        select_airegulator_options=select_airegulator_options+'<option value="'+allairegulators[j].id+'">'+allairegulators[j].name+'</option>';
                    }
        
                }
                select_airegulator_options=select_airegulator_options+'</select>';
  
                str = str + '<tr><td width="50%">' + documentsData[i].owner + '</td><td width="50%">' + documentsData[i].docName + '</td><td width="50%"> ' + documentsData[i].docAIApprovalStatus + '</td><td><img  width="25" height="25" src="./img/approveicon.png"  onclick="return documentAIAction(\''+documentsData[i].documentId+'\',\'approve\');"></img><img  width="25" height="25" src="./img/rejecticon.png"  onclick="return documentAIAction(\''+documentsData[i].documentId+'\',\'reject\');"></img></td><td><div>'+select_airegulator_options+'</div></td><td><div id="td_'+documentsData[i].documentId+'"></div></td></tr>';
              }
            }

            str = str + '</table>'
            return str;
        });

        //update dashboard
        $('.reviewandapprove').html(function() {
            var allairegulators = data.allairegulatorsList;

            var str = '<table width="100%"  class="blueTable  documentList" border="1" cellspacing="1" cellpadding="4"><tr><th>Member</th> <th>Document Name </th> <th>Action </th><th>ML-Option</th><th>ML-Prediction</th></tr>';
            var documentsData = data.approvalPendingList;
            if(documentsData)
            {
              for (var i = 0; i < documentsData.length; i++) {
                var doc_id=documentsData[i].documentId;
                var select_airegulator_options = '<select id="selectregulatorids_'+documentsData[i].documentId+'" onchange="callML(\''+documentsData[i].documentId+'\',\''+formCardId+'\');"><option value="select">select</option>"';
                if(allairegulators.length>0)
                {
                    for(var j=0; j<allairegulators.length;j++)
                    {
                        select_airegulator_options=select_airegulator_options+'<option value="'+allairegulators[j].id+'">'+allairegulators[j].name+'</option>';
                    }
        
                }
                select_airegulator_options=select_airegulator_options+'</select>';
                    str = str + '<tr><td>' + documentsData[i].owner + '</td><td > <a href=/api/viewfile?documentId='+documentsData[i].documentId +'&cardId='+formCardId +'&partnerId='+formregulatorId+' target=”_blank” >' + documentsData[i].docName +'</a></td><td> <img  width="25" height="25" src="./img/approveicon.png"  onclick="return documentAIAction(\''+documentsData[i].documentId+'\',\'approve\');"></img><img  width="25" height="25" src="./img/rejecticon.png"  onclick="return documentAIAction(\''+documentsData[i].documentId+'\',\'reject\');"></img></td><td><div>'+select_airegulator_options+'</div></td><td><div id="td_'+documentsData[i].documentId+'"></div></td></tr>';
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

function callML(documentId,formCardId){
    var selectedaivalidator = document.getElementById("selectregulatorids_"+documentId).value;
    if(!selectedaivalidator.includes('select')){

  var inputData = '{"documentId":"'+documentId+'","selectedaivalidatorid":"'+selectedaivalidator+'","cardid":"'+formCardId+'"}';
  $.ajax({
    type: 'POST',
    url: apiUrl + 'callMLModel',
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
        document.getElementById('td_'+documentId).innerHTML='service error';
        return;
      } else {
        document.getElementById('td_'+documentId).innerHTML=data.mlResult;
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
}}

function documentAIAction(documentId,action) {

  //get user input data
  var formregulatorId = $('.regulator-id input').val();
  var formCardId = $('.card-id input').val();

  //create json data
  var inputData = '{' + '"regulatorid" : "' + formregulatorId + '", ' + '"cardid" : "' + formCardId + '", "documentId" :"'+documentId+'","actiontype":"'+action+'"}';
  console.log(inputData);

  //make ajax call
  $.ajax({
    type: 'POST',
    url: apiUrl + 'documentAIAction',
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
        var allairegulators = data.allairegulatorsList;
        $('.dashboards').html(function() {

          var str = '<table width="100%"  class="blueTable  documentList" border="1" cellspacing="1" cellpadding="4"><tr><th>Member</th><th>Document Name</th><th>Current Status</th><th>Action</th><th>ML-Option</th><th>ML-Prediction</th></tr>';
          var documentsData = data.approvedDocs;
          if(documentsData.length>0)
          {
            for (var i = 0; i < documentsData.length; i++) {
              var select_airegulator_options = '<select id="selectregulatorids_'+documentsData[i].documentId+'" onchange="callML(\''+documentsData[i].documentId+'\',\''+formCardId+'\');"><option value="select">select</option>"';
              if(allairegulators.length>0)
              {
                  for(var j=0; j<allairegulators.length;j++)
                  {
                      select_airegulator_options=select_airegulator_options+'<option value="'+allairegulators[j].id+'">'+allairegulators[j].name+'</option>';
                  }
      
              }
              select_airegulator_options=select_airegulator_options+'</select>';
              str = str + '<tr><td>' + documentsData[i].owner + '</td><td>' + documentsData[i].docName + '</td><td> ' + documentsData[i].docAIApprovalStatus + '</td><td><img  width="25" height="25" src="./img/approveicon.png"  onclick="return documentAIAction(\''+documentsData[i].documentId+'\',\'approve\');"></img><img  width="25" height="25" src="./img/rejecticon.png"  onclick="return documentAIAction(\''+documentsData[i].documentId+'\',\'reject\');"></img></td><td><div>'+select_airegulator_options+'</div></td><td><div id="td_'+documentsData[i].documentId+'"></div></td></tr>';
            }
          }

          str = str + '</table>'
          return str;
      });

      //update dashboard
      $('.reviewandapprove').html(function() {

          var str = '<table width="100%"  class="blueTable  documentList" border="1" cellspacing="1" cellpadding="4"><tr><th>Member</th> <th>Document Name </th> <th>Action </th><th>ML-Option</th><th>ML-Prediction</th></tr>';
          var documentsData = data.approvalPendingList;
          if(documentsData)
          {
            for (var i = 0; i < documentsData.length; i++) {
              var doc_id=documentsData[i].documentId;
              var select_airegulator_options = '<select id="selectregulatorids_'+documentsData[i].documentId+'" onchange="callML(\''+documentsData[i].documentId+'\',\''+formCardId+'\');"><option value="select">select</option>"';
              if(allairegulators.length>0)
              {
                  for(var j=0; j<allairegulators.length;j++)
                  {
                      select_airegulator_options=select_airegulator_options+'<option value="'+allairegulators[j].id+'">'+allairegulators[j].name+'</option>';
                  }
      
              }
              select_airegulator_options=select_airegulator_options+'</select>';
              str = str + '<tr><td>' + documentsData[i].owner + '</td><td > <a href=/api/viewfile?documentId='+documentsData[i].documentId +'&cardId='+formCardId +'&partnerId='+formregulatorId+' target=”_blank” >' + documentsData[i].docName +'</a></td><td> <img  width="25" height="25" src="./img/approveicon.png"  onclick="return documentAIAction(\''+documentsData[i].documentId+'\',\'approve\');"></img><img  width="25" height="25" src="./img/rejecticon.png"  onclick="return documentAIAction(\''+documentsData[i].documentId+'\',\'reject\');"></img></td><td><div>'+select_airegulator_options+'</div></td><td><div id="td_'+documentsData[i].documentId+'"></div></td></tr>';
            }
          }

          str = str + '</table>';
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
var apiUrl = location.protocol + '//' + location.host + "/api/";

console.log("at register.js");

//check user input and call server to create dataset
$('.register-retailer').click(function() {

  //get user input data
  var formAccountNum = $('.account-number input').val();
  var formCardId = $('.card-id input').val();
  var formFirstName = $('.first-name input').val();
  var formLastName = $('.last-name input').val();
  var formEmail = $('.email input').val();
  var formPhoneNumber = $('.phone-number input').val();

  //create json data
  var inputData = '{' + '"firstname" : "' + formFirstName + '", ' + '"lastname" : "' + formLastName + '", ' + '"email" : "' + formEmail + '", ' + '"phonenumber" : "' + formPhoneNumber + '", ' + '"accountnumber" : "' + formAccountNum + '", ' + '"cardid" : "' + formCardId + '"}';
  console.log(inputData)

  //make ajax call to add the dataset
  $.ajax({
    type: 'POST',
    url: apiUrl + 'registerRetailer',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //display loading
      document.getElementById('registration').style.display = "none";
      document.getElementById('loader').style.display = "block";
    },
    success: function(data) {

      //remove loader
      document.getElementById('loader').style.display = "none";

      //check data for error
      if (data.error) {
        document.getElementById('registration').style.display = "block";
        alert(data.error);
        return;
      } else {
        //notify successful registration
        document.getElementById('successful-registration').style.display = "block";
        document.getElementById('registration-info').style.display = "none";
      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      //reload on error
      alert("Error: Try again")
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
    }
  });

});


//check user input and call server to create dataset
$('.register-distributor').click(function() {

  //get user input data
  var formName = $('.name input').val();
  var formDistributorId = $('.distributor-id input').val();
  var formCardId = $('.card-id input').val();

  //create json data
  var inputData = '{' + '"name" : "' + formName + '", ' + '"distributorid" : "' + formDistributorId + '", ' + '"cardid" : "' + formCardId + '"}';
  console.log(inputData)

  //make ajax call to add the dataset
  $.ajax({
    type: 'POST',
    url: apiUrl + 'registerDistributor',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //display loading
      document.getElementById('registration').style.display = "none";
      document.getElementById('loader').style.display = "block";
    },
    success: function(data) {

      //remove loader
      document.getElementById('loader').style.display = "none";

      //check data for error
      if (data.error) {
        document.getElementById('registration').style.display = "block";
        alert(data.error);
        return;
      } else {
        //notify successful registration
        document.getElementById('successful-registration').style.display = "block";
        document.getElementById('registration-info').style.display = "none";
      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      //reload on error
      alert("Error: Try again")
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
    }
  });

});

//check user input and call server to create dataset
$('.register-manufacture').click(function() {

  //get user input data
  var formName = $('.name input').val();
  var formManufactureId = $('.manufacture-id input').val();
  var formCardId = $('.card-id input').val();

  //create json data
  var inputData = '{' + '"name" : "' + formName + '", ' + '"manufactureid" : "' + formManufactureId + '", ' + '"cardid" : "' + formCardId + '"}';
  console.log(inputData)

  //make ajax call to add the dataset
  $.ajax({
    type: 'POST',
    url: apiUrl + 'registerManufacture',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //display loading
      document.getElementById('registration').style.display = "none";
      document.getElementById('loader').style.display = "block";
    },
    success: function(data) {

      //remove loader
      document.getElementById('loader').style.display = "none";

      //check data for error
      if (data.error) {
        document.getElementById('registration').style.display = "block";
        alert(data.error);
        return;
      } else {
        //notify successful registration
        document.getElementById('successful-registration').style.display = "block";
        document.getElementById('registration-info').style.display = "none";
      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      //reload on error
      alert("Error: Try again")
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
    }
  });

});

/*
 * Copyright (c) 2015 Advanced Community Information Systems (ACIS) Group, Chair
 * of Computer Science 5 (Databases & Information Systems), RWTH Aachen
 * University, Germany All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 * 
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 * 
 * Neither the name of the ACIS Group nor the names of its contributors may be
 * used to endorse or promote products derived from this software without
 * specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

var client, dataStorage = [];

var init = function() {
  
  var iwcCallback = function(intent) {
    // define your reactions on incoming iwc events here
    console.log(intent);
    if (intent.action == "showTable") {
      responseAction(intent.data);
    }
  };
  
  client = new Las2peerWidgetLibrary("http://gaudi.informatik.rwth-aachen.de:8082/ToDoList", iwcCallback);
  
Y({
  db: {
    name: 'memory'
  },
  connector: {
    name: 'websockets-client',
    room: 'cae-room'
  },
  sourceDir: "http://y-js.org/bower_components",
  share: {
    inputData:'Text',
    dataList:'Text',
    messageStatus:'Text'
  }
}).then(function (y) {
  window.yTextarea = y

  y.share.inputData.bind(document.getElementById('inputData'))
  y.share.dataList.bind(document.getElementById('dataList'))
  y.share.messageStatus.bind(document.getElementById('messageStatus'))
})



  $('#DisplayButton').on('click', function() {
    ShowData();
  })
  $('#SendButton').on('click', function() {
    SentMessage();

  })
  $('#DeleteButton').on('click', function() {
    DeleteMessage();
  })
}


// callTable
var callTable = function(){
  var dataJSON = {}
  dataJSON["list"] = dataStorage;
  //client.sendIntent("showTable",  JSON.stringify(dataJSON));
}


// DeleteMessage
var DeleteMessage = function(){
  var DeleteContent = parseInt($("#inputData").val());
  console.log(DeleteContent);
  deleteMessageFunction(DeleteContent);
}


// ShowData
var ShowData = function(){
  reloadData();
  $("#messageStatus").val("Data fetched!");
   
}

var reloadData = function(){

  $("#messageStatus").val("Get Data");
  var DataContent = null;
  var textData = "";
  for(var i = 0;i < dataStorage.length;i++){
    textData += (i+1)+": "+dataStorage[i]+"\n";
  }

  $('#TextArea1').attr("rows", dataStorage.length);
    $("#dataList").val(textData);
    $("#messageStatus").val("");
}

// SentMessage
var SentMessage = function(){
  var listContent = $("#inputData").val();
  sendMessageFunction(listContent);
}


// responseAction
var responseAction = function(data){
  console.log(data);
  var dataJSON = JSON.parse(data);
  if(data){
    reloadData(dataJSON.list);    
  }else{
    $("#messageStatus").val("No data found!");
  }

}

var sendMessageFunction = function(contentData){
  dataStorage.push(contentData);
}

function isInteger(x) {
    return x % 1 === 0;
}

var deleteMessageFunction = function(index){
  console.log(isInteger(index));
  var isInt = isInteger(index);
  if (isInt) {
    console.log("True");
    if(dataStorage.length==0){
      $("#messageStatus").val("No data found!");
      console.log("dataStorage zero");
    }
    else{
        if(index > 0 || index <= dataStorage.length){
          dataStorage.splice(index-1,1);
        }
        else{
          console.log("Index not found");
          $("#messageStatus").val("Invalid input data!");
        }    
    }
  }
  else{
    $("#messageStatus").val("Invalid input data!");
  }  
 

}


$(document).ready(function() {
  init();
});

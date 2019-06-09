var baseUrl = "http://34.243.3.31:8080";
var currentPage;
var currentChannel;
var creator;



/*Function that sends Get-Requests*/
function sendGet(addToUrl){
    return $.ajax({
        url: baseUrl+addToUrl,
        headers: {"X-Group-Token": "Enter Token",},
        dataType: "json",
        method: "GET",
    });
};

/*Function that sends Post-Request*/
function sendPost(addToUrl, giveData){
    console.log("heööp");
   return $.ajax({
        url: baseUrl+addToUrl,
        headers: {"X-Group-Token": "glvWcuOo6Rl7",},
        contentType: "application/json",
        method: "POST",
        data: giveData,
    });
};

/*Function that updates the channel list*/
function updateChannelList(data) {
    $("#channelList").empty();
    $.each(data._embedded.channelList, function (key, value) {
        $("#channelList").append($("<a>").attr("id",value.id).attr("href","").text(value.name));
    })
};

/*Function that updates the channel list*/
function enterChannel() {
    if(creator==undefined){creator="Unbekannt"};
    console.log(JSON.stringify({ "creator": creator, "content": creator+" joined the Channel"}));
    sendPost("/channels/"+currentChannel+"/messages",JSON.stringify({ "creator": creator, "content": creator+" joined the Channel" }));
};




/*JQuery after the document is loaded*/
$(function(){

    /*Function that loads the 20 first channels on to the channelList*/
    sendGet("/channels").done(function (data) { updateChannelList(data); });


});

/*JQuery after the document is loaded*/
$(document).ready(function () {



    /*Function that loads channels every 10 seconds on to the channelList*/
    setInterval(function(){sendGet("/channels?page="+currentPage).done(function (data) { updateChannelList(data); })},10000);

    /*Function that opens entered Channel Page*/
    $("#selectChannelPageForm").submit(function (event) {
        currentPage = $("#selectChannelPageForm").find('[name="page"]').val();
        sendGet("/channels?page=" + currentPage).done(function (data) { updateChannelList(data); });
        event.preventDefault();
    });

    /*Function that creates a new channel*/
    $("#newChannelForm").submit(function (event) {
    sendPost("/channels", JSON.stringify({ "name": $("#newChannelForm").find('[name="channel"]').val(), "topic": $("#newChannelForm").find('[name="topic"]').val()})).done(function() {
        alert( "Creating new Channel was successful!" );
      })
      .fail(function() {
        alert( "Creating new Channel was unsuccessful!" );
      });
    event.preventDefault();
    });

    /*Function to open a channel*/
    $( "#channelList" ).on("click","a", function(e) {   
        e.preventDefault();
        $("#currentChannel").text($(this).text())
    
     });
        
     /*Function to enter a channel*/
    $( "#enterChannelForm" ).submit( function(e) {   
        e.preventDefault();
        creator = $(this).find('[name="creator"]').val();
        enterChannel()  ;
      
     });


});






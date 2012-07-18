/* Author:

*/

 $(document).ready(function(){
      var socket = io.connect(window.location.hostname);
      socket.on('tweet', function (data) {
        //console.log(data);
        addTweet(strdecode(data));
      });
  });

function strdecode( data ) {
  return JSON.parse( decodeURIComponent( escape ( data ) ) );
}

function addTweet(tweetText){
    //create a tweet div to add
    var tweetDiv = $("<div class='tweet'><span>"+tweetText+"</span></div>");    
    //select the tweets container
    var tweets = $('#tweets');

    var wrap = $('#wrap');

    //add the tweet to the container
    tweets.append(tweetDiv);
    
    //get the width so we know how far to move it until it's offscreen
    var tweetWidth = tweetDiv.find('span:first').width();
    
    //pick a random y location
    var yLoc = Math.floor(Math.random()*wrap.height());
    //pick a random speed
    var speed = Math.random()*4000+12000;
      
    //add highlights for keywords        
    highlightTweet(tweetDiv);        

    //position the tweet offscreen at the right edge
    tweetDiv.offset({left:tweets.width(),top:yLoc});
    
    //CSS3 transition method to fly across the screen
    tweetDiv.transition({ x:(tweets.width()+tweetWidth)*-1 },speed,'in-out',function(){tweetDiv.remove()});      
}

/**
 * Highlight keywords like Model Metrics and Salesforce.com
 **/                        
function highlightTweet(tweetDiv) {
    tweetDiv.highlight('model metrics',{className:'highlightModelMetrics'});
    tweetDiv.highlight('ModelMetricsInc',{className:'highlightModelMetrics'});
    tweetDiv.highlight('salesforce',{className:'highlightSalesforce'});
    tweetDiv.highlight('forcedotcom',{className:'highlightSalesforce'});
    tweetDiv.highlight('force.com',{className:'highlightSalesforce'});
    tweetDiv.highlight('chatter',{className:'highlightSalesforce'});
    tweetDiv.highlight('social',{className:'highlightSalesforce'});
    tweetDiv.highlight('dreamforce',{className:'highlightSalesforce'});
    tweetDiv.highlight('df12',{className:'highlightSalesforce'});
    tweetDiv.highlight('aws',{className:'highlightAWS'});
    tweetDiv.highlight('amazon',{className:'highlightAWS'});
    tweetDiv.highlight('amazon web services',{className:'highlightAWS'});
    tweetDiv.highlight('cloud',{className:'highlightCloud'});
    tweetDiv.highlight('iphone',{className:'highlightMobile'});
    tweetDiv.highlight('mobile',{className:'highlightMobile'});
    tweetDiv.highlight('android',{className:'highlightMobile'});
    tweetDiv.highlight('html5',{className:'highlightMobile'});
}
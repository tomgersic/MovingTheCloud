# [Moving the Cloud](http://www.modelmetrics.com/art-of-code)

Moving the Cloud is an experiment in using HTML5 and CSS3 technologies and Node.js. It was also an experiment on using Node.js on the Cedar stack in Heroku, but that didn't quite work out as expected (more on that later). It's also an Easter egg on the [Model Metrics Homepage](http://www.modelmetrics.com/). Click on the animated 1s and 0s down in the bottom left corner of the screen to get to it.

I was asked to put together a temporary (it'll probably be around for a few months) artsy installation piece for the Art of Code section on modelmetrics.com. Going into the project, I wanted to do a social media visualization because, well, I think they're cool. Some of my favorite examples are [Twistori.com](http://twistori.com/) and [Vizeddit](http://erqqvg.com/vizeddit/) -- they visualize [Twitter](twitter.com) and [Reddit](reddit.com) respectively.

Moving the Cloud uses Node.js to pull tweets containing some keywords like "Cloud", "Salesforce", "Social", "Mobile", or "Model Metrics" from the Twitter Streaming API and stream them to clients using websockets. They move across the screen right to left, sort of like a cloud -- GET IT? (nudge nudge wink wink)? There's a screenshot down below. Here's some details:

##Setup

You'll need Node.js installed to run this. The server is set to run on port 8888 unless you have an environment variable set to put it somewhere else. On many systems, you'll have to run it as root if you want to start it on port 80. Starting the server is pretty easy. This will get it running:

`node server.js`

You'll also need to install some node packages with npm: express, ntwitter, socket.io, and ws.

I recommend using [Forever](http://blog.nodejitsu.com/keep-a-nodejs-server-up-with-forever) to handle server crashes, etc. Node.js tends to crash more frequently than, say, Apache, so Forever is a good way of keeping your server running in case something happens. Install Forever with npm:

`sudo npm install -g forever`

And then you'll be able to start the server.js script with:

`forever -a start -l forever.log -o out.log -e error.log server.js`

Then just connect your browser to http://localhost:8888

##Twitter Streaming API

The Twitter Streaming API (well, technically APIs) allows you to open up a long-running socket connection with Twitter, and stream tweets that match a certain criteria. For this, I used the Public Stream API with the /filter endpoint so that I could receive tweets that matched my keywords. Technically, you could do this directly from the client using HTML5 websockets, but you have to authenticate with Twitter. You can generate keys for a specific app at [dev.twitter.com](http://dev.twitter.com), so you don't have to just hard-code your Twitter username and password into the app, but still, you don't really want to embed that in client-side code. So, in this example, I'm using Node.js as a go-between. It authenticates with Twitter, sets up a socket connection with the Streaming API, and dispatches those tweets out to any clients (browsers) that connect to it.

##Node.js

If you haven't used [Node.js](http://nodejs.org/), you should. It's a way to run Javascript on the server-side that takes advantage of Javascript's inherent event-based non-blocking nature to create a server that works especially well for realtime or data-intensive apps like instant messaging apps. It's possible to build a regular website (like a blog or something) with it using [Express](http://expressjs.com/) (which I am using here for simplicity), but I'm not sure it's necessarily the best choice for something like that, as RoR, PHP, and Python (for instance) already do a pretty good job in that space. For a Twitter streaming API app, though, Node is great. 

The Node.js server script itself pretty simple--it uses the [node-twitter](https://github.com/jdub/node-twitter) library to connect to Twitter, and [Socket.io](http://socket.io/) to handle the setting up the websocket connections with whatever client browser happens to connect to it. It also handles fallback to XHR long polling for browsers that don't support websockets. Aside from an array to hold active connections and some error handling, that's about it on the server side.

##HTML5/CSS3

Like I said earlier, one of my goals for this project was to demonstrate some HTML5 and CSS3 technologies. Because of that, it does not work on IE. It would probably be possible to get it sort of working in IE by falling back from HTML5/CSS3 technologies to older ones, but it wouldnt' work as well, and sometimes you just have to leave the old crappy browsers behind. It does work perfectly fine on current versions of Chrome, Safari, Firefox, Mobile Safari (iPhone/iPad), and the Android Browser, though the transitions are kind of choppy on Firefox. Anyway, here's some of what's going on:

###WebSockets

[Websockets](http://en.wikipedia.org/wiki/WebSocket) are awesome. If you're familiar with client/server programming, you're probably familiar with the concept of sockets. If you're not, you use them all the time anyway. With a typical HTTP request, for instance, a socket connection is opened with the server, a request is made (GET, POST, etc.), a response is given and the socket is closed. In order for the server to be able to *push* data down to the client, a socket connection needs to stay open. 

There are some hacks like [XHR Long Polling](http://en.wikipedia.org/wiki/Comet_(programming)) (Comet) that work on older browsers, basically by opening a dummy request socket and delaying the response until something push-worthy happens, but it's limited by the  HTTP 1.1 spec that says a browser should have no more than 2 open sockets with a server, and, well, it's hacky. Websockets, on the other hand, let you open up a bi-directional full-duplex socket between a web browser and a server. In Moving The Cloud, tweets are sent from the Node.js server to the each client using websockets. Socket.io handily fails back to XHR long polling if websockets aren't available.

###CSS3 Transitions

CSS3 transitions allow you to do 2D and 3D transformations without using any Javascript. This is great because, for the most part, it's faster to do things in CSS where possible. On some platforms, it's even hardware accelerated. Webkit-based browsers even include a special mode that lets you see which elements are hardware accelerated. This is Safari's CA_COLOR_OPAQUE=1 mode:

![Screenshot](http://mm-tom.s3.amazonaws.com/movingthecloud/css3_composite_safari.jpg)

Show hardware acceleration in Safari [CA_COLOR_OPAQUE=1](http://mir.aculo.us/2011/02/08/visualizing-webkits-hardware-acceleration/)

Show hardware acceleration in Chrome [--show-composited-layer-borders](http://www.html5rocks.com/en/tutorials/speed/html5/)

Firefox, best I can tell, does not have a similar mode. And CSS3 transitions are really slow in the current version of Firefox, too. So, I guess Mozilla has some work to do on that front.

In Moving the Cloud, I used the [JQuery Transit](http://ricostacruz.com/jquery.transit/) plugin because it handles fallbacks to Javascript transitions when CSS3 transitions aren't available.

###CSS3 Web Fonts

Web Fonts use the [@font-face](http://www.w3schools.com/css3/css3_fonts.asp) rule to include font files that can be hosted on the web -- they don't have to be installed on the viewer's computer. This has given rise to some great services like [Google Web Fonts](http://www.google.com/webfonts/) and [fontsforweb.com](http://fontsforweb.com/). This is great, because the Model Metrics logo uses GothamLight, which isn't a typical web font. In the olden-days, back when onions were worn on belts, logos that had to use a specific font would typically just be images, and the font for the rest of the site would just be a web-safe font that was close enough. 

For instance, the rest of the modelmetrics.com site (except the logo) uses the Helvetica font family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif. My bit uses GothamLight:

`@font-face{ 
    font-family: "GothamLight";
    src: url('http://fontsforweb.com/public/fonts/1151/GothamLight.eot');
    src: local("Gotham-Light"), url('http://fontsforweb.com/public/fonts/1151/GothamLight.ttf') format("truetype");
}
.fontsforweb_fontid_1151 {
  font-family: "GothamLight";
}`

###CSS3 Opacity

CSS3 adds an [opacity](http://www.css3.info/preview/opacity/) parameter, so any element can a specified level of opacity (or what most people would call transparency). It's pretty simple to use -- just add an opacity: attribute to an HTML element, and specify a value. The footer in Moving the Cloud, for instance, has an opacity value of 0.9. Just enough so that you can see tweets floating by underneath.

###HTML5 Boilerplate

When starting a new web app, it's often a good idea to start with a reset.css to normalize your app across browsers. [HTML5 Boilerplate](http://html5boilerplate.com/) gives you that and more. It's is a ""professional front-end template that helps you build fast, robust, adaptable, and future-proof websites". It's a great starting point for an HTMl5 app that handles many of the idiosyncrasies between various browsers.

##Known Issues

Moving the Cloud works quite well in most modern browsers, but there are some known issues:

###Internet Explorer

Doesn't work -- right now I'm just using an [if IE] statement to show a message to the user that they should use a different browser -- yes, I know this is bad form, but it's not a critical portion of the website, and it's meant to demonstrate new technologies not imitations of new technologies. Partially it doesn't work because IE doesn't support Websockets or CSS3 Transitions, but technically speaking, Socket.io should be able to fail back to XHR long polling, and JQuery Transit should be able to fail back to Javascript, so I'm not 100% sure why it isn't working. I could spend some more time on it, but to be honest, even if I got it working, I'm assuming it will be really slow and crappy anyway.

###Firefox

Speaking of which, it's kind of slow and crappy on Firefox. I think this is just because CSS3 transitions are slow and crappy on Firefox. Mozilla really needs to step it up -- it runs great on my iPhone but not Firefox on a new MacBook Pro.

###Heroku

I _really_ wanted to get this working in Heroku. Really really really did. And, technically it does work -- on one dyno. I think the issue is that the Cedar stack doesn't support websockets, so it has to use XHR Long Polling, and even though it should work with a [RedisStore](https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO) as a man in the middle, it works sort of intermitently if you try to scale the app up to use more than one dyno. So, it's running in EC2. More information [here on stackoverflow.com](http://stackoverflow.com/questions/11064826/using-socket-io-and-redis-on-heroku-with-node-js).

##Screenshot
![Screenshot](http://mm-tom.s3.amazonaws.com/movingthecloud/screenshot.small.jpg)


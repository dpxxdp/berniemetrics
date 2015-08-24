#Berniemetrics
###Watch It Bern

[![Build Status](https://travis-ci.org/dpxxdp/berniemetrics.svg?branch=master)](https://travis-ci.org/dpxxdp/berniemetrics)

We like numbers and we *love* the numbers that surround Bernie Sanders' incredible summer-2015 surge.  Berniemetrics aims to be the premier site for keeping track of all numbers Bernie.

We're still getting a few things off the ground right now, but in the mean time if you're interested in helping out- please email berniemetrics@gmail.com and we'll add you to the slack.  We're particularly looking for graphic designers, front end developers, and web developers who have experience with D3.

If you're looking to install the full server locally so that you can play around with it, the steps are below.  The meat of the installation is in the pre-reqs, if you already have the pre-reqs installed it will be relatively painless.  Email berniemetrics@gmail.com or ping the slack if you run into any issues.

#Installation

Berniemetrics is hosted as a web application built using a [MEANJS](http://meanjs.org/) stack. That is- [MongoDB](http://www.mongodb.org/), [Node.js](http://www.nodejs.org/), [Express](http://expressjs.com/), and [AngularJS](http://angularjs.org/) based applications.

## Prerequisites
Make sure you have installed all these prerequisites on your development machine.
* Node.js - [Download & Install Node.js](http://www.nodejs.org/download/) and the npm package manager, if you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages, in order to install it make sure you've installed Node.js and npm, then install bower globally using npm:

```
$ npm install -g bower
```

* Grunt - You're going to use the [Grunt Task Runner](http://gruntjs.com/) to automate your development process, in order to install it make sure you've installed Node.js and npm, then install grunt globally using npm:

```
$ sudo npm install -g grunt-cli
```

## Cloning Berniemetrics

Use Git to directly clone the berniemetrics repository.  This will clone it into the current local directory.
```
$ git clone https://github.com/dpxxdp/berniemetrics.git
```

## Quick Install
Once you've downloaded the source code and installed all the prerequisites, you're just a few steps away from starting your server.

The first thing you should do is install the Node.js dependencies, so change into your berniemetrics directory:

```
$ cd berniemetrics
```

and then run this in the command-line:

```
$ npm install
```

This command does a few things:
* First it will install the dependencies needed for the application to run.
* If you're running in a development environment, it will then also install development dependencies needed for testing and running your application.
* Finally, when the install process is over, npm will initiate a bower install command to install all the front-end modules needed for the application

## Running Your Application
After the install process is over, you'll be able to run your application using Grunt, just run grunt default task:

```
$ grunt
```

Your application should run on the 3000 port so in your browser just go to [http://localhost:3000](http://localhost:3000)
                            
That's it! your application should be running by now, to proceed with your development check the other sections in this documentation. 
If you encounter any problem try the Troubleshooting section, email berniemetrics@gmail.com, or ping the slack group.

## Credits
Thank you to the folks at MEAN.JS.  They've written 90% of the code (and these installation instructions) to help us get these sites off the ground as painless as possible.
Inspired by the great work of [Madhusudhan Srinivasa](https://github.com/madhums/)
The MEAN name was coined by [Valeri Karpov](http://blog.mongodb.org/post/49262866911/the-mean-stack-mongodb-expressjs-angularjs-and)

## License
(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

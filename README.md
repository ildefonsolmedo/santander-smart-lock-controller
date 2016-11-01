Middleware nodejs piece that interfaces with the Ethereum RPC Api.


### Version
0.0.2


### Tech

Prerequisites
-------------

* node.js > 4.x
* git


Deployment checklist
--------------------

* Install or update prerequisites (Only once)
* Download the source (Only once)
* Set environment
* Checkout a tag/version
* Configure app (certificates, secrets for enviromnent...)
* Install dependencies
* Start the app

Download
--------

For deployment (read only, public access)

    git clone

For development (full access, auth. users)

    git clone

Checkout an specific tag
------------------------

Execute this commands in the app folder

    git fecth # update local repository
    git checkout v1.0.0 # checkout version v1.0.0

Set environment
---------------

Choose one:

    # Local development
    export NODE_ENV=development

    #MACPRO-DEV
    export NODE_ENV=development

    # Preproduction and pilot
    export NODE_ENV=preproduction

    # Production and pre-production
    export NODE_ENV=production

Install dependencies
--------------------

Choose one:

    # Without proxy
    npm install

    # Proxy
    HTTP_PROXY=http://your-proxy:8080 npm install

This process also execute build after install all the dependencies

Setup and data migration
------------------------

(This is no required, It is done by npm install post hook)

Choose one:

    npm run setup

WARNING: setup must be executed with the same environment as the application process.

Service tests
-------------
Environment should be set at this point

	npm test


Start server
------------

Choose one:

    #Local development - monitor server changes and restart
    nodemon
    # Install it with "npm install -g nodemon"

    #local UI development
    npm start

    #Audit can be enabled by changing default value for "audit" in configuration files

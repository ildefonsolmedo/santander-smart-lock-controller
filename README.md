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

Creating a new node in private network
---

1. Create a folder and place a `genesis.json` inside it containing the following:
```
{
    "nonce": "0x0000000000000042",
    "timestamp": "0x0",
    "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "extraData": "0x0",
    "gasLimit": "0x8000000",
    "difficulty": "0x400",
    "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "coinbase": "0x3333333333333333333333333333333333333333",
    "alloc": {
    }
}
```

2. Run `geth --datadir <created folder> init <created folder>/genesis.json`. This will create a `chaindata` folder.

3. Create a new account with `geth --datadir <created folder> account new`. You can issue this command as much times as accounts are needed. For the needs of the PoC the accounts needn't have passwords. Created accounts can be listed using `geth --datadir <created folder> account list`.

4. Start the node using
`geth --datadir <created folder> --networkid 123 --ipcpath <created folder>/geth.ipc --nodiscover --solc solc --rpc --rpccorsdomain "*" --unlock 0,1 console`. If it's a mining node `--mine --minerthreads 2` can be appended. If you need to run multiple nodes on the same machine they should have different discovery and RPC ports. This is done by appending `--port 30304 --rpcport 8546` to the above command.

5. Set up node discovery

In order for a node to connect to others in our network, we need to setup a `static-nodes.json` file in the working directory. Get all of the nodes ID URIs by issuing the `admin.nodeInfo.enode` command in each node's console. Then add the node URIs of the particular nodes that you'd like your node to connect to as strings in an array:
```
[
	"enode://be03340ed41e08f0387f5f4b5418eae6b890d56685c397b4ece438b2de346d41e6aa885594336f079d56199864391d11a81fb4fbf819dde2cfecf100e016acc6@10.42.0.108:30303",
	"enode://648685ddaf45bc6799a30114c1402884e64c503ec04792e2fb9de05aee4f8b1de6fe62253ccea39088ed0090573fb69ff6fb2fce2ec22b5b80e5d25fa812ede9@127.0.0.1:30304"
]
```

Ethereum node details
---

### Stefan-Laptop miner 1

#### Command to start it



#### Node URI

`enode://583bd7834f8a27b8bb213c6bfc413fc08c350b55dc882c27e090364044b11b3d4c2effbaa10ab0d6edd6e0676dcfee5022bace095dd45dc2426c4d3089c30649@10.42.0.165:30303`

#### Accounts

- `0x40ead8d2363fbad416ee0f156a922dcad52ce321` (etherbase)
- `0x0351b5f592c5cf37bb277a9d55e97ffacd08b990`
- `0x4fe5a35c4cf3d09dc7cf9eb311d9e315b6ef8812`

### Stefan-Laptop miner 2

#### Node URI

`enode://188b5c92fde85f22e7e18af703d4976d4024ceeeeb61f50e1a2ec09cf4adff622ba8591866d741b22c7e472bba7ae8e6007df854bbd6186ec83f05c6bafd5a06@10.42.0.165:30304`

#### Accounts

- `0x0491615b945056a0a2015ca5678971628fa00fbe` (etherbase)

### Smart locker non-miner

#### Node URI

`enode://be03340ed41e08f0387f5f4b5418eae6b890d56685c397b4ece438b2de346d41e6aa885594336f079d56199864391d11a81fb4fbf819dde2cfecf100e016acc6@10.42.0.108:30303`

#### Accounts

- `0xf521e52133f9668b2fb22a8778452e82c34595bd`
- `0x459a7db5b046455817750cdb5be67b081ed6e33d`

### Contract creation log

```
Running migration: 1_initial_migration.js
  Deploying Migrations...
  Migrations: 0x7193bbb44a148ec2760243ebe151ac4831814a4e
Saving successful migration to network...
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Deploying BlockDatesLib...
  BlockDatesLib: 0xdea5c1ba932812025067684f6236fdbce243f64a
  Linking BlockDatesLib to Lock
  Deploying Lock...
  Lock: 0x3bfe60eb4bbf455f564a70d74c9a40dc3e11566d
Saving successful migration to network...
Saving artifacts...
```

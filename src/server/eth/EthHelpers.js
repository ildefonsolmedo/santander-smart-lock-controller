/*jslint node: true*/

'use strict';

var Exceptions = require('./EthExceptions'),
    config = require('config'),
    unirest = require('unirest'),
    fs = require('fs'),
    Web3 = require('web3'),
    web3 = new Web3();

    web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

module.exports = {
  contract: {
    get: function (contract) {
        return new Promise(function (resolve, reject) {
  
            fs.readFile(__dirname + '/contracts/' + contract, function (err, data) {
                
                if (err) {
                    reject(err);
                } else {
                    resolve(data.toString());
                }

            });

        });
    },
    call: function (contract,from,data,method) {
      return new Promise(function (resolve, reject) {
        //0x4d9a495a37fe996177583158c1aefd363a122f55
        var str = web3.toAscii('0xc6888fa10000000000000000000000000000000000000000000000000000000000000003');
            console.log('strrrrrr',str);
      });

    },
    instance: function (contract,address) {
        return new Promise(function (resolve, reject) {
          
          this.get(contract + '.abi')
          .then(function (err,result) {
            if (err) {
              reject(err);
            } else {
              let abi = JSON.parse(result),
                  contractInstance = web3.eth.contract(abi);

                  resolve(contractInstance.at(contractAddress));
            } 
          });

        });
    },
    saveAbi: function (contract,abi) {
      
      let _abi = JSON.stringify(abi);

      return new Promise(function (resolve, reject) {
        
          fs.writeFile(__dirname + '/contracts/' + contract + '.abi', _abi, function(err) {
              if(err) {
                 reject(err);
              } else {
                resolve(true);
              }
          });

      });
      
    },
    new: function (contract,code,abi,sender,wait) {
      return new Promise(function (resolve, reject) {
        web3.eth.contract(abi).new(
            ['0xa742ba1022b4d534ddf09fe7bb017362180adc55','0x2fb6b07057adaea104f25054d073947c438d3968'], 
            2,
            10,
            {
            
            from: web3.eth.accounts[sender], 
            data: code,
            gas: config.eth.contractGas
        }, function (err, contract) {
          if(err) {
              reject(err);
            } else {
                // return response right after trx is sent, do not wait until it is mined 
                if (wait) {
                    // callback fires twice, we only want the second call when the contract is deployed
                    if (contract.address) {
                        resolve(contract);
                        //dbSrv.addLog('newcontract','Contract ' + name + ' deployed','eth',primaryAddress,null,contract.address,contract.transactionHash,null);
                    }
                } else {
                  resolve(contract);
                }
                
            }
        });

      });

    },
  },
  account: {
    coinbase: function() {
      module.exports.rpc.call(
        'eth_coinbase',
        null,
        69
      )
      .then(function (result) {
        resolve(result.result);
      })
      .catch(function(err){
        reject(err);
      });
    },
    unlock: function(account,secret) {
      return new Promise(function (resolve, reject) {

        let accountObject = accounts.get(address,secret);
      
        if (accountObject.locked) {
          reject({error: {message: 'could not unlock'}});
        } else {
          resolve({status: 'success', public: accountObject.public});
        }

      });
    },
    default: function(account) {
      web3.eth.defaultAccount = web3.eth.accounts[account];
    },
    get: function(account) {
      return web3.eth.accounts[account];
    }
  },
  trx: {
    call: function (from,to,data) {
      return new Promise(function (resolve, reject) {
        console.log('to',to);
        console.log('data',data);
        web3.eth.call({
            to: to, 
            data: data
        }, function(err, result){
          if (!err) {
            resolve(result);
          } else {
            reject(err);
          }
        });

      }); 
    },
    send: function (from, to, code) {
      return new Promise(function (resolve, reject) {
        
        web3.eth.sendTransaction({from: from, to: to,data: code, gas: 100000}, function(err, address) {
          if (!err) {
            resolve(address);
          } else {
            reject(err);
          }
        });

      }); 
    },
    get: function (transactionHash) {
      return new Promise(function (resolve, reject) {
        web3.eth.getTransaction(transactionHash, function (err, transaction) {
          if(err) {
            reject(err);
          } else {
            resolve(transaction);
          }
        });

      }); 

    }
  },
  util: {
    compile : function (contract) {
        return new Promise(function (resolve, reject) {

          web3.eth.compile.solidity(contract, function(error, result){
              if(!error) {
                resolve(result)
              } else {
                reject(error)
              }   
          })

        });
    },
    sig: function (sig) {
        return web3.sha3(sig).substr(0, 8);
    },
    status : function () {
        return new Promise(function (resolve, reject) {
 
          if (web3.isConnected()) {
              var _info = {
                  api: web3.version.api
                  //ethereum: web3.version.ethereum,
                  //network: web3.version.network,
                  //node: web3.version.node,
                  //provider: web3.currentProvider
              }
              resolve(_info);
          } else {
            reject('Ethereum node not started');
          }
        
        });
    },
    getContractOrAbi: function(name) {

        return new Promise(function (resolve, reject) {
 
          fs.readFile(__dirname + '/contracts/' + name, function (err, data) {
            
            if (err) {
                reject(err);
            } else {
                resolve(data.toString());
            }

          });
        
        });

    },
    saveAbi: function(name,abi) {
      
      return new Promise(function (resolve, reject) {
 
          fs.writeFile(__dirname + '/contracts/' + name + '.abi', abi, function(err) {
              if(err) {
                reject(err);
              } else {
                resolve(true);
              }
          });
        
        });
       
    }
  }
};
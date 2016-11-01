/* 

    isbanCoin - ₴ (http://www.fileformat.info/info/unicode/char/20b4/index.htm)

    PoC - digital currency.

    - Bonus
    - Rewards to team
    - Buy holidays
    - Sell holidays
    - Pay for... 'things'

*/

contract IsbanCoin {

    bytes32 isbanAddress;
    string  symbol;
    uint testcoin;

    struct isbanWallet {
        uint redCoin;
        uint brownCoin;
        uint greenCoin;
    }

    mapping (bytes32 => isbanWallet) public balances;

    /* This generates a public event on the blockchain that will notify clients */
    event Transfer(bytes32 indexed from, bytes32 indexed to, uint256 value);

    // constructor
    function IsbanCoin() {
        isbanAddress = 'XXXXXXXX';
        symbol = "₴";
        balances[isbanAddress].redCoin   = 10000;
        balances[isbanAddress].greenCoin = 10000;
    }

    function totalSupply() constant returns (uint256 supply) {
        return 100000; //TODO Change
    }

    function createRed(uint _value) returns(bool success) {
        //if (msg.sender!=isbanAddress) throw;
        balances[isbanAddress].redCoin += _value;
        return true;
    }

    function createGreen(uint _value) returns(bool success) {
        //if (msg.sender!=isbanAddress) throw;
        balances[isbanAddress].greenCoin += _value;
        return true;
    }

    function sendRed(bytes32 _from, bytes32 _to, uint _value) {
        //TODO check that only allowed adddresses can send coins
        if (balances[_from].redCoin < _value) throw;
        balances[_from].redCoin -= _value;
        balances[_to].redCoin += _value;


        /* Notifiy anyone listening that this transfer took place */
        Transfer(_from, _to, _value);

    }

    function sendGreen(bytes32 _from, bytes32 _to, uint _value) {
        //TODO check that only allowed adddresses can send coins
        if (balances[_from].greenCoin < _value) throw;
        balances[_from].greenCoin -= _value;
        balances[_to].greenCoin += _value;

        /* Notifiy anyone listening that this transfer took place */
        Transfer(_from, _to, _value);

    }

    function getGreenBalance(bytes32 _address) constant returns(uint256 balance) {
        //TODO check that only allowed adddresses can check balances
        return balances[_address].greenCoin;
    }

    function getRedBalance(bytes32 _address) constant returns(uint256 balance) {
        //TODO check that only allowed adddresses can check balances
        return balances[_address].redCoin;
    }

    function finalize() returns(bool success) {
        
        //if (msg.sender!=isbanAddress) throw;
        suicide(msg.sender);
        return true;

    }

    function () {
        // This function gets executed if a
        // transaction with invalid data is sent to
        // the contract or just ether without data.
        // We revert the send so that no-one
        // accidentally loses money when using the
        // contract.
        throw;
    }

}
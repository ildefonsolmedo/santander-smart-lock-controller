pragma solidity ^0.4.0;

//import "BlockDatesLib.sol";

// Reporting Contract

contract Report {
	
	bool status;
	uint needed;
	uint total;
	uint current;
	uint lastunlocked;
	uint waituntillock;
	address[] oadmins;
	address creator;

	struct Unlocker {
        bool status;
        uint exists;
    }

    //Unlocker[] public admins;
    mapping(address => Unlocker) public admins;

	event Unlocked(address indexed _addr, bool _status, uint _wehave, uint _needed);

	function Lock(address[] _adminlist, uint _needed, uint _waituntillock) {
		status = false;
		needed = _needed;
		waituntillock = _waituntillock;
		creator  = msg.sender;
		total = _adminlist.length;
		current = 0;
		oadmins = _adminlist;

		for (uint i = 0; i < total; i++) {
			admins[_adminlist[i]].status = false;
			admins[_adminlist[i]].exists = 1;
        }
	}

	function unlock() returns(bool) {	
		
		if (admins[msg.sender].exists == 0) throw;

		if (status==true && isLockValid(lastunlocked,waituntillock)) {
			status = false;
			current = 0;
			for (uint i = 0; i < total; i++) {
				admins[oadmins[i]].status = false;
			}
		}

		if (admins[msg.sender].status != true) {
			admins[msg.sender].status = true;
			current++;
		}

        if (current>=needed) {
        	lastunlocked = block.number;
        	status = true;
        	// event
			Unlocked(msg.sender, status, current, needed);
			return true;
        } else {
        	return false;
        }
		
	}

	function check() returns(bool) {
		if (status==true && !isLockValid(lastunlocked,waituntillock)) {
			status = false;
			current = 0;
			for (uint i = 0; i < total; i++) {
				admins[oadmins[i]].status = false;
			}
		}
		return true;
	}

	function lock() returns(bool) {
		status = false;
		return true;
	}

	function getCurrentBlock() returns(uint) {
		return block.number;
	}

	function getCreator() returns(address) {
		return creator;
	}

	function getStatus() constant returns(bool) {
		if (status==true && isLockValid(lastunlocked,waituntillock)) {
			status = false;
			return true;
		} else {
			status = true;
			return false;
		}
	}

	function unlockerStatus(address addr) constant returns(bool) {
		if (msg.sender==creator) {
			return admins[addr].status;
		} else {
			throw;
		}	
	}

	function getWaitUntilLock() constant returns(uint) {
		return waituntillock;
	}

	function getCurrent() constant returns(uint) {
		return current;
	}

	function getNeeded() constant returns(uint) {
		return needed;
	}

	function kill() { 
        if (msg.sender==creator) {
            suicide(creator); 
        }
    }
	
	function isLockValid(uint lastunlocked, uint allowedwait) returns (bool convertedAmount) {
		if (block.number>(lastunlocked+allowedwait)) {
			return false;
		} else {
			return true;
		}
	}

}
contract Democracy {

    uint public minimumQuorum;
    uint public debatingPeriod;
    address public founder;
    Subject public subject;
    uint public numProposals;

    //event Voted(uint proposalID, int position, address voter);

    struct Subject {
        bytes32 data;
        string description;
        uint creationDate;
        bool active;
        Vote[] votes;
        mapping (address => bool) voted;
    }

    struct Vote {
        int position;
        address voter;
    }

    function Democracy(uint _minimumQuorum, uint _debatingPeriod) {
        founder = msg.sender;  
        voterShare = token(_voterShareAddress);
        minimumQuorum = _minimumQuorum || 10;
        debatingPeriod = _debatingPeriod * 1 minutes || 30 days;
    }


    function newProposal(address _recipient, uint _amount, bytes32 _data, string _description) returns (uint proposalID) {
        if (voterShare.coinBalanceOf(msg.sender)>0) {
            proposalID = proposals.length++;
            Proposal p = proposals[proposalID];
            p.recipient = _recipient;
            p.amount = _amount;
            p.data = _data;
            p.description = _description;
            p.creationDate = now;
            p.active = true;
            ProposalAdded(proposalID, _recipient, _amount, _data, _description);
            numProposals = proposalID+1;
        }
    }

    function vote(bool _value) returns (uint voteID){
        if (voterShare.coinBalanceOf(msg.sender)>0) { // ??
            Proposal p = proposals[_proposalID];
            if (subject.voted[msg.sender] == true) return;
            voteID = subject.votes.length++;
            subject.votes[voteID] = Vote({value: _value, voter: msg.sender});
            subject.voted[msg.sender] = true;
            //Voted(_proposalID,  _position, msg.sender);
        }
    }

    function executeProposal() returns (int result) {
        Proposal p = proposals[_proposalID];
        /* Check if debating period is over */
        if (now > (p.creationDate + debatingPeriod) && p.active){   
            uint quorum = 0;
            /* tally the votes */
            for (uint i = 0; i <  p.votes.length; ++i) {
                Vote v = p.votes[i];
                uint voteWeight = voterShare.coinBalanceOf(v.voter); 
                quorum += voteWeight;
                result += int(voteWeight) * v.position;
            }
            /* execute result */
            if (quorum > minimumQuorum && result > 0 ) {
                p.recipient.call.value(p.amount)(p.data);
                p.active = false;
            } else if (quorum > minimumQuorum && result < 0) {
                p.active = false;
            }
        }
    }
}
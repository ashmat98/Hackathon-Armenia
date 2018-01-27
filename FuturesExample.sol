pragma solidity ^0.4.11;
contract BinaryFuture{
    
    struct Future{
        uint256 expires;
        uint256 buyIn;
        uint256 startValue;
        uint256 endValue;
        string query;
        address queryAddress;
        address long;
        address short;
        address winner;
        FuturesStage stage;        
    }
    
    enum FuturesStage{
        Unfilled,
        ReadyStart,
        ContractLive,
        ReadyEnd,
        ReadySettle
    }
    
    enum Positions{
        Long,
        Short
    }
    
    event Query(string queryString, address queryAddress);
    
    Future future;
    
    function BinaryFuture(
        uint256 expires, 
        uint256 buyIn, 
        string queryString, 
        address queryAddress){
            
        future.expires = expires;
        future.buyIn = buyIn;
        future.stage = FuturesStage.Unfilled;
        future.query = queryString;
        future.queryAddress = queryAddress;
    }

    //take "long" or "short" position with msg.value == future.buyIn
    function fillPosition(uint256 position) public payable {
        if (msg.value != future.buyIn) throw;
        if (position == 0){
            if (future.long == address(0)) {
                throw;
            }
            else 
                future.long = msg.sender;
        }
        if (position == 1){
            if (future.short == address(0)) throw;
            else future.short = msg.sender;
        }
        if (future.long == address(0) && future.short == address(0))
            future.stage = FuturesStage.ReadyStart;
    }
    
    //make query for future.startValue
    function startContract() public {
        if (future.stage != FuturesStage.ReadyStart)
            throw;
        queryOracle(future.stage, future.query);
    }
    
    //make query for future.endValue
    function endContract() public {
        if (future.stage != FuturesStage.ReadyEnd)
            throw;
        queryOracle(future.stage, future.query);
    }
    
    //compare future.startValue with future.endValue, payout to and short proportionally
    function settleContract() public {
        if (future.stage != FuturesStage.ReadySettle)
            throw;
        if (future.startValue > future.endValue)
            future.winner = future.short;
        if (future.startValue < future.endValue)
            future.winner = future.long;
    }
    
    //emit query event
    function queryOracle(FuturesStage stage, string query) internal {
        Query(query, future.queryAddress);
    }
    
    //handle oracle response
    function oracleCallback(uint256 response){
        if (future.stage == FuturesStage.ReadyStart){
            future.startValue = response;
            future.stage = FuturesStage.ContractLive;
        }
        if (future.stage == FuturesStage.ReadyEnd){
            future.startValue = response;
            future.stage = FuturesStage.ReadySettle;
        }
    }
        
    //are positions unfilled =>Unfilled (0)    
    //is contract ready to start ( make query for future.startValue) =>ReadyStart (1)
    //is contract startValue set and is yet to expire =>ContractLive (2)
    //is contract ready to end (make query for future.endValue) =>ReadyEnd (3)
    //is contract ready to settle payouts via future.startValue and future.endValue =>ReadySettled (4)
    function getStatus() constant returns(FuturesStage stage){
        if (future.long == address(0) || future.short == address(0))
            return FuturesStage.Unfilled;
        if (future.startValue == 0) return FuturesStage.ReadyStart;
        if (future.expires > now) return FuturesStage.ContractLive;
        if (future.endValue == 0) return FuturesStage.ReadyEnd;
        return FuturesStage.ReadySettle;
    }        
        
    function getBuyIn() constant returns(uint256 buyIn){
        return future.buyIn;
    }   
        
    function getWinner() constant returns(address winner){
        return future.winner;
    }
    
    function getLong() constant returns(address long){
        return future.long;
    }

    function getShort() constant returns(address short){
        return future.short;
    }
    
}

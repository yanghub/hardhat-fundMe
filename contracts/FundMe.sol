// SPDX-License-Identifier: MIT

// 使用usd，智能合约
pragma solidity 0.8.7; //^0.8.8后可用
// 接口
import "./PriceConverter.sol";
// 以上接口

error NotOwner();

/**
 * @title A contra for crowd funding
 * @author jock
 * @notice
 */
contract FundMe {
    using PriceConverter for uint256;
    // State
    mapping(address => uint256) private s_addressToAmountFunded;
    address[] private s_funders; // 记录发送资金
    address private immutable i_owner; // 合约拥有者
    uint256 public constant MINNUM_USD = 50 * 10 ** 18; // 常量
    AggregatorV3Interface private s_priceFeed;

    constructor(address priceFeedAddress) {
        // 构造函数
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    // 启动回调函数
    // receive() external payable {
    //     fund();
    // }

    // fallback() external payable {
    //     fund();
    // }

    // 发送
    /**
     * @notice function funds
     */
    function fund() public payable {
        // usd,msg.value.getConVersionRate()
        require( //getConversionRate
            msg.value.getConversionRate(s_priceFeed) >= MINNUM_USD,
            "Didn't send enough"
        ); //1e18 = 1*10*18
        s_addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender); //全局关键字
    }

    // 交换
    function withdraw() public payable onlyOwner {
        // == 判断变量是否等价

        // 循环语句
        for (
            uint256 funderInndex = 0;
            funderInndex < s_funders.length;
            funderInndex++
        ) {
            // code
            address funder = s_funders[funderInndex];
            s_addressToAmountFunded[funder] = 0;
        }
        // reset the array
        s_funders = new address[](0);
        // actually withdraw the funds
        // 三种调用方式，发送货币
        //   transfer,失败自动回滚交易
        //   payable(msg.sender).transfer(address(this).balance);
        //   // send,返回是否成功，否则报错
        //   bool sendSuccess = payable(msg.sender).send(address(this).balance);
        //   require(sendSuccess,"Send failed");
        // call bool callSuccess, bytes memory dataReturned
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "call failed");
        revert();
    }

    // 省gas
    function cheaperWithdraw() public payable onlyOwner {
        address[] memory funders = s_funders;
        // mapping cant be in memory
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success);
    }

    // 修饰器
    modifier onlyOwner() {
        require(msg.sender == i_owner, "Send is not owner");
        if (msg.sender != i_owner) {
            revert NotOwner();
        }
        _;
    }

    // view / Pure  getter
    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmountFunded(
        address funder
    ) public view returns (uint256) {
        return s_addressToAmountFunded[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}

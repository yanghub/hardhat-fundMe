// function deployFunc() {
//     console.log("Hi!")
// }
// module.exports.default = deployFunc

const { network } = require("hardhat")
const { networkConfig } = require("../help-harthat-config")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../help-harthat-config")
const { verify } = require("../utils/verify")
// const { getNamedAccounts, deployments } = require("hardhat")

//创建最小合约测试mock
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // chain is X use adress Y....
    //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, // put price feed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.evn.ETHERSCAN_API_KEY
    ) {
        // verify
        await verify(fundMe.address, args)
    }

    log("————————————————————————————————————————")
}

module.exports.tags = ["all", "FundMe"]

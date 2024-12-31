const { task } = require("hardhat/config")

task("block-number", "Prints an account's balance").setAction(
    async (taskArgs, hre) => {
        //匿名函数
        const blockNumber = await hre.ethers.provider.getBlockNumber()

        console.log(blockNumber, "ETH")
    }
)

module.exports = {}

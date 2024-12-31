const { log } = require("console")
const { getNamedAccounts, ethers } = require("hardhat")

async function main(params) {
    const { deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContractAt("FundMe", deployer) //v5-getContract   v6-getContractAt
    console.log("Funding Contract...")
    const transactionRespose = await fundMe.fund({
        value: ethers.parseEther("0.1"),
    })
    await transactionRespose.wait(1)
    console.log("Funded!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

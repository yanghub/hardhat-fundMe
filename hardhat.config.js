require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("@nomicfoundation/hardhat-verify")
// require("@nomiclabs/hardhat-etherscan")  旧版verify
require("./tasks/block-number")
require("hardhat-gas-reporter")
require("solidity-coverage")
require("hardhat-deploy")

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "http://cccc.com"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "key"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key"
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "key"

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    // solidity: "0.8.7",
    solidity: {
        compilers: [{ version: "0.8.7" }, { version: "0.6.7" }],
    },
    defaultNetwork: "hardhat",
    networks: {
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmations: 6,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            // accounts: hardhat,
            chainId: 31337,
        },
    },
    etherscan: {
        //验证
        apiKey: ETHERSCAN_API_KEY,
        // apiKey: "",
    },
    gasReporter: {
        enabled: true,
        // url: "http://127.0.0.1:8545/",
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        gasPriceApi:
            "https://api.etherscan.io/api?module=proxy&action=eth_gasPrice",
        coinmarketcap: COINMARKETCAP_API_KEY,
        offline: false,
    },
    namedAccounts: {
        deployer: {
            default: 0,
            // 31137:1
        },
        user: {
            default: 1,
        },
    },
}

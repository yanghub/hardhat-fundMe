const { run } = require("hardhat")
// 自动验证
// async function verify(contractAddress, args)
const verify = async (contractAddress, args) => {
    console.log("Verifying contract....")
    try {
        await run("verify:verify", {
            address: contractAddress, // 修正拼写: "adress" -> "address"
            constructorArguments: args, // 参数保持不变
        })
        console.log("Contract verified successfully!")
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Contract is already verified.")
        } else {
            console.error("Verification failed:", e.message)
        }
    }
}

module.exports = { verify }

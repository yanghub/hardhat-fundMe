// // 系统测试
// const { assert } = require("chai")
// const { deployments, ethers, getNamedAccounts } = require("hardhat")

// describe("FundMe", async function () {
//     let fundMe
//     let deployer
//     let mockV3Aggregator
//     // beforeEach(async function () {
//     //     // deploy our fundMe contract
//     //     // using Hardhat-deploy
//     //     // const accounts = await ethers.getSigners()   //账户
//     //     // const accountZerof = accounts[0]
//     //     deployer = (await getNamedAccounts()).deployer
//     //     await deployments.fixture(["all"])
//     //     fundMe = await ethers.getContractAt("FundMe", deployer)
//     //     mockV3Aggregator = await ethers.getContractAt("mockV3Aggregator")
//     // })
//     beforeEach(async function () {
//         // // 获取部署者账户
//         // deployer = (await getNamedAccounts()).deployer

//         // // 部署所有脚本
//         // await deployments.fixture(["all"])

//         // // 获取部署的合约实例 (适配 Ethers.js v6)
//         // const fundMeDeployment = await deployments.get("FundMe")
//         // fundMe = await ethers.getContractAt(
//         //     "FundMe",
//         //     fundMeDeployment.address,
//         //     deployer
//         // )

//         // const mockDeployment = await deployments.get("MockV3Aggregator")
//         deployer = (await getNamedAccounts()).deployer
//         await deployments.fixture(["all"])
//         mockV3Aggregator = await deployments.get("MockV3Aggregator", deployer)
//     })

//     describe("constructor", async function () {
//         it("sets the aggregator sddresses correcttly", async function () {
//             const Response = await fundMe.getPriceFeed()
//             assert.equal(Response, mockV3Aggregator.address)
//         })
//     })
// })

const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", function () {
          let fundMe
          let deployer
          let mockV3Aggregator
          const sendValue = ethers.parseEther("1") //1000000000000000000 //18个0
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer

              // 部署所有脚本
              await deployments.fixture(["all"])

              // 获取 FundMe 合约实例
              const fundMeDeployment = await deployments.get("FundMe")
              fundMe = new ethers.Contract(
                  fundMeDeployment.address,
                  fundMeDeployment.abi,
                  ethers.provider // 使用 provider Runner
              )

              // 获取 MockV3Aggregator 合约实例
              const mockDeployment = await deployments.get("MockV3Aggregator")
              mockV3Aggregator = new ethers.Contract(
                  mockDeployment.address,
                  mockDeployment.abi,
                  ethers.provider // 使用 provider Runner
              )
          })

          describe("constructor", function () {
              it("sets the aggregator addresses correctly", async function () {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, mockV3Aggregator.address)
              })
          })

          describe("fund", function () {
              it("fails if not enough ETH is sent", async function () {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "You need to spend more ETH"
                  )
              })
          })

          it("updated the amount funded data structure", async function () {
              await fundMe.fund({ value: sendValue })
              const response = awaitxfundMe.getAddressToAmountFunded(
                  deployer.address
              )
              assert.equal(response.toString(), sendValue.toString())
          })
          it("Adds funder to array of getFunder", async function () {
              await fundMe.fund({ value: sendValue })
              const funder = await fundMe.getFunder(0)
              assert.equal(funder, deployer.address)
          })

          describe("withdraw", async function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue })
              })
              // 单个投资账号测试
              it("Withdraw ETH from a single founder", async function () {
                  // Arrange
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.aderess)

                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, gasPrice } = transactionReceipt //把一些对象从另一个对象中拿出来
                  const gasCost = gasUsed * gasPrice

                  constendingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  // Assert
                  assert.equal(endingDeployerBalance, 0)
                  assert.equal(
                      startingFundMeBalance.add(endingDeployerBalance),
                      stErtingDeployerBalance.add(gasCost).toString()
                  )
              })

              it("cheaperWithdraw testing......", async function () {
                  // Arrange
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.aderess)

                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  // Act
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, gasPrice } = transactionReceipt //把一些对象从另一个对象中拿出来
                  const gasCost = gasUsed * gasPrice

                  constendingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  // Assert
                  assert.equal(endingDeployerBalance, 0)
                  assert.equal(
                      startingFundMeBalance.add(endingDeployerBalance),
                      stErtingDeployerBalance.add(gasCost).toString()
                  )
              })

              // 多个投资账号测试
              it("allows us to withdraw with multiple s_fundMe", async function () {
                  // Arrange
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, gasPrice } = transactionReceipt //把一些对象从另一个对象中拿出来
                  const gasCost = gasUsed * gasPrice

                  constendingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  // Assert
                  assert.equal(endingDeployerBalance, 0)
                  assert.equal(
                      startingFundMeBalance.add(endingDeployerBalance),
                      stErtingDeployerBalance.add(gasCost).toString()
                  )

                  // fendMe可以重置
                  // Make sure that the s_fundMe are reset properly
                  await expect(fundMe.s_fundMe(0)).to.be.reverted

                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })

              it("Only allows the s_owner to withdraw", async function () {
                  //调用其他账户回滚
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const attackerConnectedContract = await fundMe.connect(
                      attacker
                  )
                  await expect(attackerConnectedContract.withdraw()).to.be
                      .reverted
              })

              // gas test
              it("cheaperWithdraw testing", async function () {
                  // Arrange
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // Act
                  const transactionResponse = await fundMe.cheaperWithdraw() //测试gas的方法
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, gasPrice } = transactionReceipt //把一些对象从另一个对象中拿出来
                  const gasCost = gasUsed * gasPrice

                  constendingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  // Assert
                  assert.equal(endingDeployerBalance, 0)
                  assert.equal(
                      startingFundMeBalance.add(endingDeployerBalance),
                      stErtingDeployerBalance.add(gasCost).toString()
                  )

                  // fendMe可以重置
                  // Make sure that the s_fundMe are reset properly
                  await expect(fundMe.s_fundMe(0)).to.be.reverted

                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })
          })
      })

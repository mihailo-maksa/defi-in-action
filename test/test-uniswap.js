const { BigNumber } = require('ethers')
const IERC20 = artifacts.require('IERC20')
const TestUniswap = artifacts.require('TestUniswap')

contract('TestUniswap', async (accounts) => {
  try {
    const USER = '0x2cD3d676F4C53D645aa523cadBf00BA049f4E8eB'
    const DAI = '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735'
    const UNI = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'

    const AMOUNT_IN = BigNumber.from('1000000000000000000000000000000')
    const AMOUNT_OUT_MIN = 1
    const TOKEN_IN = DAI
    const TOKEN_OUT = UNI
    const TO = accounts[0]

    it('should swap', async () => {
      try {
        const tokenIn = await IERC20.at(TOKEN_IN)
        const tokenOut = await IERC20.at(TOKEN_OUT)
        const testUniswap = await TestUniswap.new()

        await tokenIn.approve(testUniswap.address, AMOUNT_IN, { from: USER })
        await testUniswap.swap(
          tokenIn.address,
          tokenOut.address,
          AMOUNT_IN,
          AMOUNT_OUT_MIN,
          TO,
          {
            from: USER,
          },
        )

        const balance = await tokenOut.balanceOf(TO)

        await console.log(`out ${balance} UNI`)
      } catch (e) {
        console.error({ shouldSwapError: e })
      }
    })
  } catch (e) {
    console.error({ testUniswapGlobalError: e })
  }
})
// ganache-cli --fork https://mainnet.infura.io/v3/2f3c4ea0eb424612a852d64474c12ae0 --unlock 0x28C6c06298d514Db089934071355E5743bf21d60 --networkId 999

// npx truffle test --network mainnet_fork test/test-uniswap.js

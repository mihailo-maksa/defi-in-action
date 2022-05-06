const { BigNumber, Contract } = require('ethers')
const IERC20 = artifacts.require('IERC20')
const TestUniswapOptimal = artifacts.require('TestUniswapOptimal')

Contract('TestUniswapOptimal', async (accounts) => {
  try {
    const USER = '0x2cD3d676F4C53D645aa523cadBf00BA049f4E8eB'
    const DAI = '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735'
    const UNI = '0xc778417E063141139Fce010982780140Aa0cD5Ab'
    const ADD_AMOUNT = BigNumber.from('1000000000000000000000')

    let contract, fromToken, toToken, pair
    beforeEach(async () => {
      try {
        fromToken = await IERC20.at(DAI)
        toToken = await IERC20.at(WETH)
        contract = await TestUniswapOptimal.new()
        pair = await IERC20.at(
          await contract.getPair(fromToken.address, toToken.address),
        )

        await fromToken.approve(contract.address, ADD_AMOUNT, { from: USER })
      } catch (e) {
        console.error({ beforeEachError: e })
      }
    })

    const snapshot = async () => {
      return {
        lpToken: await pair.balanceOf(contract.address),
        fromToken: await fromToken.balanceOf(USER),
        toToken: await toToken.balanceOf(USER),
      }
    }

    it('optimal swap', async () => {
      try {
        await contract.zap(fromToken.address, toToken.address, ADD_AMOUNT, {
          from: USER,
        })
        const after = await snapshot()
        console.log(
          `LP: ${after.lpToken.toString()}, DAI: ${after.fromToken.toString()}, WETH: ${after.toToken.toString()}`,
        )
      } catch (error) {
        console.error({ optimalSwapError: error })
      }
    })
  } catch (e) {
    console.error({ globalUniswapOptimalError: e })
  }
})

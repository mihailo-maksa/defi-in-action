const BN = require('bn.js')
const { sendEther, pow, DAI, USDC, USDT, USER } = require('./utils')

const IERC20 = artifacts.require('IERC20')
const TestCurveExchange = artifacts.require('TestCurveExchange')

Contract('TestCurveExchange', (accounts) => {
  const TOKEN_IN = DAI
  const TOKEN_IN_INDEX = 0
  const TOKEN_IN_DECIMALS = 18
  const TOKEN_OUT = USDC
  const TOKEN_OUT_INDEX = 1
  const TOKEN_OUT_DECIMALS = 6
  const TOKEN_IN_AMOUNT = pow(10, TOKEN_IN_DECIMALS).mul(new BN(1000000))

  let testContract, tokenIn, tokenOut

  beforeEach(async () => {
    tokenIn = await IERC20.at(TOKEN_IN)
    tokenOut = await IERC20.at(TOKEN_OUT)
    testContract = await TestCurveExchange.new()

    const bal = await tokenIn.balanceOf(USER)

    assert(bal.gte(TOKEN_IN_AMOUNT), 'Balance is less than TOKEN_IN_AMOUNT')

    await tokenIn.transfer(testContract.address, TOKEN_IN_AMOUNT, {
      from: USER,
    })
  })

  it('should swap 1 million DAI for USDC', async () => {
    const snapshot = async () => {
      return {
        tokenOutBalance: await tokenOut.balanceOf(testContract.address),
      }
    }

    const before = await snapshot()
    console.log({ beforeSnapshot: before.tokenOutBalance })

    await testContract.swap(TOKEN_IN_INDEX, TOKEN_OUT_INDEX)

    const after = await snapshot()
    console.log({ afterSnapshot: after.tokenOutBalance })
  })
})

const { BigNumber, Contract } = require('ethers')
const IERC20 = artifacts.require('IERC20')
const TestUniswapLiquidity = artifacts.require('TestUniswapLiquidity')

Contract('TestUniswapLiquidity', async () => {
  try {
    const USER = '0x2cD3d676F4C53D645aa523cadBf00BA049f4E8eB'
    const DAI = '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735'
    const UNI = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
    const ADD_AMOUNT = BigNumber.from('1000000000000000000000000000000')

    it('should add and remove liquidty', async () => {
      try {
        const tokenA = await IERC20.at(DAI)
        const tokenB = await IERC20.at(UNI)
        const testUniswap = await TestUniswapLiquidity.new()

        await tokenA.approve(testUniswap.address, ADD_AMOUNT, { from: USER })
        await tokenB.approve(testUniswap.address, ADD_AMOUNT, { from: USER })

        let tx = await testUniswap.addLiquidity(
          tokenA.address,
          tokenB.address,
          ADD_AMOUNT,
          ADD_AMOUNT,
          {
            from: USER,
          },
        )
        console.log('=== Add Liquidity ===')
        for (const log of tx.logs) {
          console.log(`${log.args.message}: ${log.args.value}`)
        }

        tx = await testUniswap.removeLiquidity(tokenA.address, tokenB.address, {
          from: USER,
        })
        console.log('=== Remove Liquidity ===')
        for (const log of tx.logs) {
          console.log(`${log.args.message}: ${log.args.value}`)
        }
      } catch (e) {
        console.error({ shouldAddAndRemoveLiquidityError: e })
      }
    })
  } catch (e) {
    console.error({ globalAddLiquidityError: e })
  }
})

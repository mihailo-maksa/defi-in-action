const BN = require('bn.js')

const USER = '0x28C6c06298d514Db089934071355E5743bf21d60'
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
const USDT = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
const WBTC = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'

const CDAI = '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643'
const CUSDC = '0x39AA39c021dfbaE8faC545936693aC917d5E7563'
const CWBTC = '0xccF4429DB6322D5C611ee964527D42E5d685DD6a'
const CETH = '0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5'

function cast(x) {
  if (x instanceof BN) {
    return x
  }
  return new BN(x)
}

function eq(x, y) {
  x = cast(x)
  y = cast(y)
  return x.eq(y)
}

function pow(x, y) {
  x = cast(x)
  y = cast(y)
  return x.pow(y)
}

function frac(x, n, d) {
  x = cast(x)
  n = cast(n)
  d = cast(d)
  return x.mul(n).div(d)
}

function sendEther(ethers, infuraUrl, from, to, amount) {
  const provider = new ethers.providers.JsonRpcProvider(infuraUrl)
  const signer = provider.getSigner(from)
  return signer.sendTransaction({
    to,
    value: ethers.utils.parseEther(amount),
  })
}

module.exports = {
  USER,
  ZERO_ADDRESS,
  DAI,
  USDC,
  USDT,
  WETH,
  WBTC,
  CDAI,
  CUSDC,
  CWBTC,
  CETH,
  eq,
  pow,
  frac,
  sendEther,
}

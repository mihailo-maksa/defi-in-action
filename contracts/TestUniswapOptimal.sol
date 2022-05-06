// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IUniswapV2Router.sol";
import "./interfaces/IUniswapV2Pair.sol";
import "./interfaces/IUniswapV2Factory.sol";
import "./interfaces/IERC20.sol";
import "./libraries/SafeMath.sol";

contract TestUniswapOptimal {
  using SafeMath for uint;

  address private constant ROUTER = 0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45;
  address private constant FACTORY = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
  address private constant WETH = 0xc778417E063141139Fce010982780140Aa0cD5Ab;

  function _swap (address _fromToken, address _toToken, uint _amount) internal {
    IERC20(_fromToken).approve(ROUTER, _amount);

    address[] memory path; 

    if (_toToken != WETH) {
      path = new address[](3);
      path[0] = _fromToken;
      path[1] = WETH;
      path[2] = _toToken;
    } else {
      path = new address[](2);
      path[0] = _fromToken;
      path[1] = _toToken;
    }

    IUniswapV2Router(ROUTER).swapExactTokensForTokens(
      _amount,
      1,
      path,
      address(this),
      block.timestamp
    );
  }

  function _addLiquidity(address _tokenA, address _tokenB) internal {
    uint balanceA = IERC20(_tokenA).balanceOf(address(this));
    uint balanceB = IERC20(_tokenB).balanceOf(address(this));
    IERC20(_tokenA).approve(ROUTER, balanceA);
    IERC20(_tokenB).approve(ROUTER, balanceB);

    IUniswapV2Router(ROUTER).addLiquidity(
      _tokenA,
      _tokenB,
      balanceA,
      balanceB,
      0,
      0,
      address(this),
      block.timestamp
    );
  }

  function sqrt(uint y) internal pure returns (uint z) {
    if (y > 3) {
      z = y;
      uint x = y / 2 + 1;
      while (x < z) {
        z = x;
        x = (y / x + x) / 2;
      }
    } else if (y != 0) {
      z = 1;
    } else {
      z = 0;
    }
  }

  /*
  s = optimal swap amount
  r = amount of reserve for token a
  a = amount of token a the user currently has (i.e. not added to reserve yet)
  f = swap fee percent (0.3% = 0.003)
  s = (sqrt(((2 - f)r)^2 + 4(1 - f)ar) - (2-f)r) / (2(1-f))
  */
  function getSwapAmount(uint r, uint a) public pure returns (uint) {
    return (sqrt(r.mul(r.mul(3988009) + a.mul(3988000))).sub(r.mul(1997))) / 1994;
  }

  function zap(address _tokenA, address _tokenB, uint _amountA) external {
    IERC20(_tokenA).transferFrom(msg.sender, address(this), _amountA);

    address pair = IUniswapV2Factory(FACTORY).getPair(_tokenA, _tokenB);

    (uint reserve0, uint reserve1 ) = IUniswapV2Pair(pair).getReserves();

    uint swapAmount;

    if (IUniswapV2Pair(pair).token0() == _tokenA) {
      swapAmount = getSwapAmount(reserve0, _amountA);
    } else {
      swapAmount = getSwapAmount(reserve1, _amountA);
    }

    _swap(_tokenA, _tokenB, swapAmount);
    _addLiquidity(_tokenA, _tokenB);
  }
}

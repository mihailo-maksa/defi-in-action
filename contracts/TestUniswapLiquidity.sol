// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IUniswapV2Router.sol";
import "./interfaces/IUniswapV2Pair.sol";
import "./interfaces/IUniswapV2Factory.sol";
import "./interfaces/IERC20.sol";
import "./libraries/SafeMath.sol";

contract TestUniswapLiquidity {
  address private constant UNISWAP_V2_ROUTER = 0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45;
  address private constant UNISWAP_V2_FACTORY = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
  address private constant WETH = 0xc778417E063141139Fce010982780140Aa0cD5Ab;

  event Log(string message, uint256 value);

  
  function addLiquidity(
    address _tokenA,
    address _tokenB,
    uint256 _amountA, 
    uint256 _amountB
  ) external {
    IERC20(_tokenA).transferFrom(msg.sender, address(this), _amountA);
    IERC20(_tokenB).transferFrom(msg.sender, address(this), _amountB);

    IERC20(_tokenA).approve(UNISWAP_V2_ROUTER, _amountA);
    IERC20(_tokenB).approve(UNISWAP_V2_ROUTER, _amountB);

    (uint256 amountA, uint256 amountB, uint256 liquidity) = IUniswapV2Router(UNISWAP_V2_ROUTER).addLiquidity(
      _tokenA,
      _tokenB,
      _amountA, 
      _amountB,
      1,
      1,
      address(this),
      block.timestamp
    );

    emit Log("amountA", amountA);
    emit Log("amountB", amountB);
    emit Log("liquidity", liquidity);
  }

  function removeLiquidity(
    address _tokenA, 
    address _tokenB
  ) external {
    address pair = IUniswapV2Factory(UNISWAP_V2_FACTORY).getPair(_tokenA, _tokenB);

    uint256 liquidity = IERC20(pair).balanceOf(address(this));

    IERC20(pair).approve(UNISWAP_V2_ROUTER, liquidity);

    (uint256 amountA, uint256 amountB) = IUniswapV2Router(UNISWAP_V2_ROUTER).removeLiquidity(
      _tokenA, 
      _tokenB,
      liquidity,
      1,
      1,
      address(this),
      block.timestamp
    );

    emit Log("amountA", amountA);
    emit Log("amountB", amountB);
  }
}

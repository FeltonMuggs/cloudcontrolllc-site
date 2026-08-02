// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IFtsoAdapter
 * @notice The ONLY oracle seam in the system. DNaIToken reads the FLR/USD price
 *         exclusively through this interface, so the real Coston2 FTSOv2 wiring
 *         is isolated to a single adapter contract.
 *
 * Returns:
 *   price     - the FLR/USD value as an unsigned integer
 *   decimals  - signed exponent; actual price = price / 10^decimals
 *               (FTSOv2 returns int8 decimals; it CAN be negative)
 *   timestamp - unix seconds the feed was last updated (for staleness checks)
 *
 * === VERIFY against current Flare docs before mainnet ===
 * The real Coston2 adapter should obtain the FtsoV2 interface via Flare's
 * ContractRegistry and call the current feed method (e.g. getFeedById with the
 * bytes21-encoded FLR/USD feed id). Interface shape is confirmed only up to the
 * assistant's knowledge cutoff; enable web search to pin the exact current call,
 * then implement FtsoV2Adapter to satisfy this interface. Nothing else changes.
 */
interface IFtsoAdapter {
    function getFlrUsdPrice()
        external
        view
        returns (uint256 price, int8 decimals, uint64 timestamp);
}

/**
 * @title MockFtsoAdapter
 * @notice Test/demo adapter. Lets tests set a price, decimals, and timestamp so
 *         the whole pricing + staleness path is exercised without a live oracle.
 *         NOT for mainnet. The real FtsoV2Adapter replaces this.
 */
contract MockFtsoAdapter is IFtsoAdapter {
    uint256 public price;
    int8 public decimals;
    uint64 public timestamp;

    constructor(uint256 _price, int8 _decimals) {
        price = _price;
        decimals = _decimals;
        timestamp = uint64(block.timestamp);
    }

    function set(uint256 _price, int8 _decimals, uint64 _timestamp) external {
        price = _price;
        decimals = _decimals;
        timestamp = _timestamp;
    }

    function getFlrUsdPrice() external view returns (uint256, int8, uint64) {
        return (price, decimals, timestamp);
    }
}

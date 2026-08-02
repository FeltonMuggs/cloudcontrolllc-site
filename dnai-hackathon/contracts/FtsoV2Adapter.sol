// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IFtsoAdapter.sol";
import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {FtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/FtsoV2Interface.sol";

/**
 * @title FtsoV2Adapter (Coston2)
 * @notice Real FTSOv2 adapter, written against @flarenetwork/flare-periphery-contracts
 *         v0.1.52 (coston2). Verified directly against the package source, NOT memory.
 *
 * KEY FACT confirmed from the package (and the reason this isn't a trivial view call):
 *   FtsoV2Interface.getFeedById(bytes21) is **payable** and may charge a fee
 *   (calculateFeeById). It is therefore NOT a view function and cannot be called
 *   from inside DNaIConsent.requiredFlrWei(), which is `view`.
 *
 * PATTERN: this adapter separates the (non-view, fee-paying) oracle read from the
 * (view) price getter that DNaIConsent consumes:
 *   - refresh()        : anyone calls (optionally with FLR to cover the feed fee);
 *                        fetches the live FLR/USD feed and caches it in storage.
 *   - getFlrUsdPrice() : plain `view`, returns the cached (price, decimals, timestamp).
 *
 * DNaIConsent enforces staleness on the cached timestamp, so a caller must refresh()
 * close in time to requesting access. A keeper/cron or the frontend can call refresh()
 * before a requestAccess(); or bundle it in the same transaction path off-chain.
 *
 * FLR/USD feed id (bytes21): category 0x01 (crypto) + "FLR/USD" ascii, zero-padded.
 *   0x01 | 46 4c 52 2f 55 53 44 | 00…  => 0x01464c522f55534400000000000000000000000000
 */
contract FtsoV2Adapter is IFtsoAdapter {
    bytes21 public constant FLR_USD_FEED_ID =
        bytes21(0x01464c522f55534400000000000000000000000000);

    uint256 public cachedPrice;
    int8 public cachedDecimals;
    uint64 public cachedTimestamp;

    event PriceRefreshed(uint256 price, int8 decimals, uint64 timestamp, uint256 feePaid);

    /// @notice Fee (in wei) the FTSOv2 will charge to read the FLR/USD feed right now.
    function feedFee() public view returns (uint256) {
        FtsoV2Interface ftsoV2 = ContractRegistry.getFtsoV2();
        return ftsoV2.calculateFeeById(FLR_USD_FEED_ID);
    }

    /**
     * @notice Fetch the live FLR/USD feed and cache it. Send >= feedFee() as msg.value;
     *         any excess is refunded to the caller.
     */
    function refresh() external payable returns (uint256 price, int8 decimals, uint64 timestamp) {
        FtsoV2Interface ftsoV2 = ContractRegistry.getFtsoV2();
        uint256 fee = ftsoV2.calculateFeeById(FLR_USD_FEED_ID);
        require(msg.value >= fee, "insufficient feed fee");

        (price, decimals, timestamp) = ftsoV2.getFeedById{value: fee}(FLR_USD_FEED_ID);
        require(price > 0, "bad feed price");

        cachedPrice = price;
        cachedDecimals = decimals;
        cachedTimestamp = timestamp;

        uint256 refund = msg.value - fee;
        if (refund > 0) {
            (bool ok, ) = payable(msg.sender).call{value: refund}("");
            require(ok, "refund failed");
        }
        emit PriceRefreshed(price, decimals, timestamp, fee);
    }

    /// @inheritdoc IFtsoAdapter
    function getFlrUsdPrice() external view returns (uint256, int8, uint64) {
        require(cachedTimestamp != 0, "no price cached; call refresh()");
        return (cachedPrice, cachedDecimals, cachedTimestamp);
    }
}

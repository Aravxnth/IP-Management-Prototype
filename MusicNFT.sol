// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts@4.9.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.9.0/token/ERC721/extensions/ERC721URIStorage.sol";

contract MusicNFT is ERC721, ERC721URIStorage {
    constructor() ERC721("MusicNFT", "MNFT") {}

    mapping(uint256 => address[]) public ownershipHistory;

    function mintSong(address to, uint256 tokenId, string memory tokenURI) public {
        _mint(to, tokenId);
        ownershipHistory[tokenId].push(to);
        _setTokenURI(tokenId, tokenURI);
    }

    function transferFrom(address from, address to, uint256 tokenId) public override(ERC721, IERC721) {
        super.transferFrom(from, to, tokenId);
        ownershipHistory[tokenId].push(to);
    }

    function getOwnershipHistory(uint256 tokenId) public view returns (address[] memory) {
        return ownershipHistory[tokenId];
    }

    // Overrides for ERC721URIStorage
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    // New override for supportsInterface
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
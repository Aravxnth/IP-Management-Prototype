import React, { useState } from 'react';
import { ethers } from 'ethers';
import MusicNFT from './MusicNFT.json';

const contractAddress = '0xe37cB402D08CE22D340Ef413bFb5666384488339'; // Contract address NOT WALLET

function App() {
  const [tokenId, setTokenId] = useState('');
  const [chain, setChain] = useState([]);
  const [metadata, setMetadata] = useState(null);

  const getNFTData = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const contract = new ethers.Contract(contractAddress, MusicNFT.abi, provider);
      const history = await contract.getOwnershipHistory(tokenId);
      setChain(history);
      const currentOwner = await contract.ownerOf(tokenId); // Fetching current owner
      const uri = await contract.tokenURI(tokenId);
      const response = await fetch(`https://ipfs.io/ipfs/${uri.split('ipfs://')[1]}`);
      const meta = await response.json();
      setMetadata({ ...meta, currentOwner }); // Storing currentOwner in metadata
    } catch (error) {
      console.error('Error fetching NFT data:', error);
      alert('Error: Check console.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#333' }}>IP Management Lookup</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter Token ID (e.g., 790)"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          style={{ padding: '8px', flex: '1', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button onClick={getNFTData} style={{ padding: '8px 16px', background: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px' }}>Check</button>
      </div>
      {chain.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ color: '#333' }}>Chain of Custody</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {chain.map((owner, index) => (
              <li key={index} style={{ padding: '5px 0', borderBottom: '1px solid #eee' }}>
                {owner.slice(0, 6) + '...' + owner.slice(-4)}
              </li>
            ))}
          </ul>
        </div>
      )}
      {metadata && (
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ color: '#333' }}>Metadata</h2>
          <p><strong>Current Owner:</strong> {metadata.currentOwner ? metadata.currentOwner.slice(0, 6) + '...' + metadata.currentOwner.slice(-4) : 'N/A'}</p>
          <p><strong>Name:</strong> {metadata.name || 'N/A'}</p>
          <p><strong>Reference:</strong> {metadata.reference || 'N/A'}</p>
          {metadata.attributes && metadata.attributes.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {metadata.attributes.map((attr, index) => (
                <li key={index} style={{ padding: '5px 0', borderBottom: '1px solid #eee' }}>
                  {`${attr.trait_type}: ${attr.value}`}
                </li>
              ))}
            </ul>
          ) : (
            <p>No attributes available</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers } from "ethers";
import { useState } from "react";
import marketplaceAddress from "./contractsData/Marketplace-address.json";
import marketplaceAbi from "./contractsData/Marketplace.json";
import nftAddress from "./contractsData/NFT-address.json";
import nftAbi from "./contractsData/NFT.json";
import "./App.scss";
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import Purchase from "./pages/Purchase";
import Listed from "./pages/Listed";
import Create from "./pages/Create";
declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider | any;
  }
}

function App() {
  const [account, setAccount] = useState(null);
  const [nftContract, setNftContract] = useState<ethers.Contract | null>(null);
  const [marketplaceContract, setMarketplaceContract] =
    useState<ethers.Contract | null>(null);

  async function web3Handler() {
    const accounts = await window.ethereum?.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    loadContracts(signer);
  }
  async function loadContracts(signer: ethers.providers.JsonRpcSigner) {
    const marketplace = new ethers.Contract(
      marketplaceAddress.address,
      marketplaceAbi.abi,
      signer
    );
    const nft = new ethers.Contract(nftAddress.address, nftAbi.abi, signer);

    setMarketplaceContract(marketplace);
    setNftContract(nft);
    console.log(nft);
  }

  return (
    <div className="App">
      <NavBar web3Handler={web3Handler} account={account} />
      <Routes>
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/listed" element={<Listed />} />
        <Route
          path="/create"
          element={
            <Create marketplace={marketplaceContract} nft={nftContract} />
          }
        />
      </Routes>
    </div>
  );
}

export default App;

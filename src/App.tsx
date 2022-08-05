import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import marketplaceAddress from "./contractsData/Marketplace-address.json";
import marketplaceAbi from "./contractsData/Marketplace.json";
import nftAddress from "./contractsData/NFT-address.json";
import nftAbi from "./contractsData/NFT.json";
import "./App.scss";
import NavBar from "./components/NavBar";
declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider | any;
  }
}

function App() {
  const [account, setAccount] = useState(null);
  const [marketplaceContract, setMarketplaceContract] =
    useState<ethers.Contract | null>(null);
  const [nftContract, setNftContract] = useState<ethers.Contract | null>(null);

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

  useEffect(() => {
    web3Handler();
  }, []);

  return (
    <div className="App">
      <NavBar />
    </div>
  );
}

export default App;

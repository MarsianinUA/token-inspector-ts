import { ethers } from 'ethers';
import * as ABI from './abis/erc-20.abi.json';

const TOKEN_ADDRESS: string = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const RPC_URL: string = 'https://eth.llamarpc.com';

(async () => {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(TOKEN_ADDRESS, ABI, provider);
    const symbol: string = await contract.symbol();

    console.log(symbol);
})();
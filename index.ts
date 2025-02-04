import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import ABI from './abis/erc-20.abi.json';

dotenv.config();

const TOKEN_ADDRESS: string = process.env.TOKEN_ADDRESS || '';
const RPC_URL: string = process.env.RPC_URL || '';

if(!TOKEN_ADDRESS || !RPC_URL){
    throw new Error('TOKEN_ADDRESS or RPC_URL are empty');
}

(async () => {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(TOKEN_ADDRESS, ABI, provider);
    const symbol: string = await contract.symbol();
    const decimals: number = await contract.decimals();

    console.log(`Token address: ${TOKEN_ADDRESS}`);    
    console.log(`Symbol: ${symbol}`);
    console.log(`Decimals: ${decimals}`);
})();
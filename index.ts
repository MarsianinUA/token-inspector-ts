import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import ABI from './abis/erc-20.abi.json';

dotenv.config();

interface NetworkConfig {
    TOKEN_ADDRESS: string;
    RPC_URL: string;
    MULTICALL_ADDRESS: string;
    provider ?: ethers.JsonRpcProvider;
}

const networks: Record<string, NetworkConfig> = {
    network1: {
        TOKEN_ADDRESS: process.env.TOKEN_ADDRESS_1 || '',
        RPC_URL: process.env.RPC_URL_1 || '',
        MULTICALL_ADDRESS: process.env.MULTICALL_ADDRESS_1 || '',
    },
    network2: {
        TOKEN_ADDRESS: process.env.TOKEN_ADDRESS_2 || '',
        RPC_URL: process.env.RPC_URL_2 || '',
        MULTICALL_ADDRESS: process.env.MULTICALL_ADDRESS_2 || '',
    }
};

const contractInterface = new ethers.Interface(ABI);

async function fetchTokenData(network: NetworkConfig) {
    if (!network.TOKEN_ADDRESS || !network.RPC_URL || !network.MULTICALL_ADDRESS) {
        throw new Error(`Missing configuration for network: ${network.RPC_URL}`);
    }

    network.provider = new ethers.JsonRpcProvider(network.RPC_URL);
    
    const multicall = new ethers.Contract(
        network.MULTICALL_ADDRESS,
        ["function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)"],
        network.provider
    );

    const calls = [
        { target: network.TOKEN_ADDRESS, callData: contractInterface.encodeFunctionData('symbol') },
        { target: network.TOKEN_ADDRESS, callData: contractInterface.encodeFunctionData('decimals')},
        { target: network.TOKEN_ADDRESS, callData: contractInterface.encodeFunctionData('totalSupply')}
    ];

    const [, returnData] = await multicall.aggregate(calls);

    return {
        symbol: contractInterface.decodeFunctionResult('symbol', returnData[0])[0],
        decimals: contractInterface.decodeFunctionResult('decimals', returnData[1])[0],
        totalSupply: contractInterface.decodeFunctionResult('totalSupply', returnData[2])[0],
        totalSupplyWei: contractInterface.decodeFunctionResult('totalSupply', returnData[2])[0] / 
        (10n ^ contractInterface.decodeFunctionResult('decimals', returnData[1])[0])
    };
}

async function main() {
    try {
        const [tokenData1, tokenData2] = await Promise.all([
            fetchTokenData(networks.network1),
            fetchTokenData(networks.network2)
        ]);

        console.log(`--- Network 1 ---`);
        console.log(`Token address: ${networks.network1.TOKEN_ADDRESS}`);
        console.log(`Symbol: ${tokenData1.symbol}`);
        console.log(`Decimals: ${tokenData1.decimals}`);
        console.log(`totalSupply: ${tokenData1.totalSupply}`);
        console.log(`totalSupplyWei: ${tokenData1.totalSupplyWei}`);

        console.log(`\n--- Network 2 ---`);
        console.log(`Token address: ${networks.network2.TOKEN_ADDRESS}`);
        console.log(`Symbol: ${tokenData2.symbol}`);
        console.log(`Decimals: ${tokenData2.decimals}`);
        console.log(`totalSupply: ${tokenData2.totalSupply}`);
        console.log(`totalSupplyWei: ${tokenData2.totalSupplyWei}`);
    } catch (error) {
        console.error('Error fetching token data:', error);
    }
}

main();

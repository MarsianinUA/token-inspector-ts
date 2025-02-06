import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import BigNumber from 'bignumber.js';
import ABI from './abis/erc-20.abi.json';

dotenv.config();

interface TokenData {
    tokenAddress: string;
    symbol: string;
    decimals:number;
    totalSupplyWei:BigInt;
    totalSupplyTokens:BigNumber;
}

interface NetworkConfig {
    tokenAddress: string;
    rpcUrl: string;
    multicallAddress: string;
    provider?: ethers.JsonRpcProvider;
}

enum ChainName {
    Ethereum = "ethereum",
    Binance = "binance",
}

const networks: Record<ChainName, NetworkConfig> = {
    [ChainName.Ethereum]: {
        tokenAddress: process.env.TOKEN_ADDRESS || "",
        rpcUrl: process.env.RPC_URL_ETHEREUM || "",
        multicallAddress: process.env.MULTICALL_ADDRESS || "",
    },
    [ChainName.Binance]: {
        tokenAddress: process.env.TOKEN_ADDRESS || "",
        rpcUrl: process.env.RPC_URL_BINANCE || "",
        multicallAddress: process.env.MULTICALL_ADDRESS || "",
    },
};

const contractInterface = new ethers.Interface(ABI);

async function fetchTokenData(network: NetworkConfig): Promise<TokenData> {
    if (!network.tokenAddress || !network.rpcUrl || !network.multicallAddress) {
        throw new Error(`Missing configuration for network: ${network.rpcUrl}`);
    }

    network.provider = new ethers.JsonRpcProvider(network.rpcUrl);
    
    const multicall = new ethers.Contract(
        network.multicallAddress,
        ["function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)"],
        network.provider
    );

    const calls = [
        { target: network.tokenAddress, callData: contractInterface.encodeFunctionData('symbol') },
        { target: network.tokenAddress, callData: contractInterface.encodeFunctionData('decimals')},
        { target: network.tokenAddress, callData: contractInterface.encodeFunctionData('totalSupply')}
    ];

    const [, returnData] = await multicall.aggregate(calls);

    const decimals: number = Number(contractInterface.decodeFunctionResult('decimals', returnData[1])[0]);
    const totalSupplyWei: BigInt = contractInterface.decodeFunctionResult('totalSupply', returnData[2])[0];
    const totalSupplyWeiBigN: BigNumber = new BigNumber((totalSupplyWei).toString());

    return {
        tokenAddress: network.rpcUrl,
        symbol: contractInterface.decodeFunctionResult('symbol', returnData[0])[0],
        decimals: decimals,
        totalSupplyWei: totalSupplyWei,
        totalSupplyTokens: totalSupplyWeiBigN.dividedBy(new BigNumber(10).pow(decimals))
    }
}

(async () => {
    try {
        const [tokenData1, tokenData2] = await Promise.all([
            fetchTokenData(networks.ethereum),
            fetchTokenData(networks.binance)
        ]);

        const formattedTokensData = [tokenData1, tokenData2].map((token) => ({
            ...token,
            totalSupplyWei: token.totalSupplyWei.toString(),
            totalSupplyTokens: token.totalSupplyTokens.toString(),
        }))

        console.table(formattedTokensData);
        
    } catch (error) {
        console.error('Error fetching token data:', error);
    }
})()

# token-inspector-ts

Addresses the provider to obtain a ERC20 **symbol**, **decimals**, **totalSupply**, **totalSupplyWei**  
All methods are executed through Multicall  
Processes networks asynchronously  
Realisation on TypeScript

# Layer Supertype

## Quick Start
1. `npm run build`
2. `npm run start`

## Expected output:  
```

                --- Network 1 ---
                Token address: 0xdAC17F958D2ee523a2206206994597C13D831ec7
                Symbol: USDT
                Decimals: 6
                totalSupply: 76922650752242969
                totalSupplyWei: 6410220896020247
                
                --- Network 2 ---
                Token address: 0x55d398326f99059fF775485246999027B3197955
                Symbol: USDT
                Decimals: 18
                totalSupply: 5184995021725083882290287995
                totalSupplyWei: 216041459238545161762095333

```

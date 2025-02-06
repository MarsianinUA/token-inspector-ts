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

  ┌─────────┬──────────────────────────────────────────┬────────┬──────────┬─────────────────────────────┬───────────────────┐
  │ (index) │ tokenAddress                             │ symbol │ decimals │ totalSupplyWei              │ totalSupplyTokens │
  ├─────────┼──────────────────────────────────────────┼────────┼──────────┼─────────────────────────────┼───────────────────┤
  │ 0       │ 'https://bsc-testnet-rpc.publicnode.com' │ 'SAT'  │ 18       │ '1000000000000000000000000' │ '1000000'         │
  │ 1       │ 'https://bsc-testnet.public.blastapi.io' │ 'SAT'  │ 18       │ '1000000000000000000000000' │ '1000000'         │
  └─────────┴──────────────────────────────────────────┴────────┴──────────┴─────────────────────────────┴───────────────────┘

```

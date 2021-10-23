# Axelar Network Dashboard - Website

This is the frontend part of the [Axelar Network Dashboard](https://axelar-testnet.coinhippo.io). The project is implemented based on Next.js platform and connect to the [Axelar Network Dashboard - Lambda functions](https://github.com/CoinHippo-Labs/axelar-network-dashboard-lambda).

## Pages
- [Home](https://axelar-testnet.coinhippo.io) - The overview network information which comprises of the current consensus state (average block height & time, the #active validators, online voting power), the latest blocks produced and the latest transactions.
- [Validators](https://axelar-testnet.coinhippo.io/validators) - Lists of the network validators with their statistics. The data shown here are categorized into 4 categories; `active`, `inactive`, `illegible`, and `deregistering`.  
- [Blocks](https://axelar-testnet.coinhippo.io/blocks) - The latest blocks and their details acending via the newest one. 
- [Transactions](https://axelar-testnet.coinhippo.io/transactions) - The latest transactions and their details acending via the latest time. 
- [Participations](https://axelar-testnet.coinhippo.io/participations) display the key generation and key sign logs.
- [Bridge Accounts](https://axelar-testnet.coinhippo.io/bridge) display Axelar owned addresses on external chains such as Ethereum Gateway contract address, bitcoin master address, etc

The dashboard also supports searching functionality. Users can serach for their Axelar wallet address or transaction information.

## Follow us
- [Website](https://coinhippo.io)
- [Twitter](https://twitter.com/coinhippoHQ)
- [Telegram](https://t.me/CoinHippoChannel)

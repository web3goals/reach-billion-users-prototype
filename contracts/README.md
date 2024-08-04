## Commands

- Install dependencies - `npm install`
- Clean project - `npx hardhat clean`
- Compile contracts and generate typechain types - `npx hardhat compile`
- Run tests - `npx hardhat test`
- Deploy contracts - `npx hardhat ignition deploy ignition/modules/USDToken.ts --network localhost`
- Run sandbox script - `npx hardhat run scripts/sandbox.ts --network localhost`
- Verify contract - `npx hardhat verify --network localhost 0x0000000000000000000000000000000000000000`
- Clean ignition deployment - `npx hardhat ignition wipe chain-11155111 USDTokenModule#USDToken`
- Generate a file with flatten constract code - `npx hardhat flatten contracts/USDToken.sol > contracts/USDToken_flat.sol`
- Run local node - `npx hardhat node`

import { Address, Hex } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

export interface TonEthAccount {
  tonAddress: string;
  ethAddress: Address;
  ethPrivateKey: Hex;
}

export function getTonEthAccount(tonAddress: string): TonEthAccount {
  const localStorageKey = "rba-ton-eth-accounts";
  const localStorageValue = localStorage.getItem(localStorageKey);
  const accounts: TonEthAccount[] = localStorageValue
    ? JSON.parse(localStorageValue)
    : [];
  let account = accounts.find((account) => account.tonAddress === tonAddress);
  if (!account) {
    const ethPrivateKey = generatePrivateKey();
    const ethAccount = privateKeyToAccount(ethPrivateKey);
    account = {
      tonAddress: tonAddress,
      ethAddress: ethAccount.address,
      ethPrivateKey: ethPrivateKey,
    };
    accounts.push(account);
    localStorage.setItem(localStorageKey, JSON.stringify(accounts));
  }
  return account;
}

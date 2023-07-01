import FungibleToken from 0xTokenAddress
//Please replace "0xTokenAddress" with the actual address of the Flow token contract you want to use.

pub contract Vault {
    pub let token: @FungibleToken.FungibleToken
    pub var totalSupply: UInt64
    pub var balanceOf: {Address: UInt64}

    // replace the tokenAddress parameter in the init function with the address of your Fungible Token contract
    init(tokenAddress: Address) {
        self.token = getAccount(tokenAddress).getCapability<&FungibleToken.Vault{FungibleToken.Receiver}>(/public/fungibleTokenReceiver)
                            .borrow()
                            ?? panic("Could not borrow receiver reference to the Vault contract")

        self.totalSupply = 0
        self.balanceOf = {}
    }

    // Function to calculate shares based on the deposited amount
    pub fun calculateShares(amount: UInt64): UInt64 {
        if self.totalSupply == 0 {
            return amount
        } else {
            let balance = self.token.balanceOf(address: self)
            return (amount * UInt64(self.totalSupply)) / balance
        }
    }

    // Function to mint shares when the user deposits tokens
    pub fun mintShares(to: Address, shares: UInt64) {
        self.totalSupply = self.totalSupply + shares
        self.balanceOf[to] = self.balanceOf[to] + shares
    }

    // Function to burn shares when the user withdraws tokens
    pub fun burnShares(from: Address, shares: UInt64) {
        self.totalSupply = self.totalSupply - shares
        self.balanceOf[from] = self.balanceOf[from] - shares
    }

    // Function to deposit tokens and receive shares
    pub fun deposit(amount: UInt64) {
        let sender = getTransaction(signer: AuthAccount).address

        let shares = self.calculateShares(amount: amount)
        self.mintShares(to: sender, shares: shares)

        let vaultRef = getAccount(self.token).getCapability<&{FungibleToken.Balance}>(/public/fungibleTokenBalance)
                            .borrow()
                            ?? panic("Could not borrow balance reference to the Token contract")

        self.token.deposit(from: sender, amount: amount)
        vaultRef.deposit(amount: amount)
    }

    // Function to withdraw tokens using shares
    pub fun withdraw(shares: UInt64) {
        let sender = getTransaction(signer: AuthAccount).address

        let amount = (shares * UInt64(self.token.balanceOf(address: self))) / self.totalSupply
        self.burnShares(from: sender, shares: shares)

        let vaultRef = getAccount(self.token).getCapability<&{FungibleToken.Balance}>(/public/fungibleTokenBalance)
                            .borrow()
                            ?? panic("Could not borrow balance reference to the Token contract")

        vaultRef.withdraw(amount: amount)
        self.token.withdraw(recipient: sender, amount: amount)
    }
}

import FlowToken from 0xTokenAddress
//Please replace "0xTokenAddress" with the actual address of the Flow token contract you want to use.

// Contract definition for a liquidity pool
pub contract LiquidityPool {
    // Initialize token
    pub var token: @FlowToken.Token
    pub var totalSupply: UFix64

    // The rate earned by the lender per second
    pub var lendRate: UFix64
    // The rate paid by the borrower per second
    pub var borrowRate: UFix64

    // Total amount currently lent in the pool
    pub var lendAmount: UFix64

    // Struct to store the amount and start time of borrowing or lending
    pub struct Amount {
        pub var amount: UFix64
        pub var start: UFix64

        // Initializer for the Amount struct
        init(amount: UFix64, start: UFix64) {
            self.amount = amount
            self.start = start
        }
    }

    // Mapping to track the amounts lent by each address
    pub var lendAmounts: {Address: Amount}
    // Mapping to track the interest earned by the lender
    pub var earnedInterest: {Address: UFix64}

    // Arrays to store the addresses of lenders and borrowers
    pub var lenders: {Address: Bool}
    pub var borrowers: {Address: Bool}

    // Mapping to track the amounts borrowed by each address
    pub var borrowAmount: {Address: Amount}
    // Mapping to track the interest to be paid by the borrower
    pub var payInterest: {Address: UFix64}

    // Events

    // Constructor function to initialize the contract
    init(tokenAddress: Address, amount: UFix64) {
        // Borrow the token capability from the given address
        self.token = getAccount(tokenAddress)
            .getCapability<&FlowToken.Token{FlowToken.Balance}>(FlowToken.BalancePath)
            .borrow() ?? panic("Could not borrow capability from token contract")

        // Set the initial supply and rates
        self.totalSupply = amount
        self.lendRate = 100.0
        self.borrowRate = 130.0

        // Initialize the lendAmount field to 0
        self.lendAmount = 0.0
    }

    /// Lend the specified amount to the liquidity pool
    pub fun lend(amount: UFix64) {
        // Ensure the amount is greater than 0
        assert(amount > UFix64(0), message: "Amount cannot be 0")

        // Transfer the tokens from the caller's account to the pool contract
        self.token.transfer(from: self.account, to: self.address, amount: amount)

        // Record the lending amount and start time for the caller
        self.lendAmounts[self.account] = Amount(amount: amount, start: getCurrentBlock().timestamp)
        self.lenders[self.account] = true

        // Update the total supply of the pool
        self.totalSupply = self.totalSupply + amount
    }

    /// Borrow the specified amount from the liquidity pool
    pub fun borrow(amount: UFix64) {
        // Ensure the amount is greater than 0
        assert(amount > UFix64(0), message: "Amount cannot be 0")

        // Record the borrowing amount and start time for the caller
        self.borrowAmount[self.account] = Amount(amount: amount, start: getCurrentBlock().timestamp)

        // Reduce the total supply of the pool by the borrowed amount
        self.totalSupply = self.totalSupply - amount

        // Transfer the borrowed tokens from the pool contract to the caller's account
        self.token.transfer(from: self.address, to: self.account, amount: amount)
        self.borrowers[self.account] = true
    }

    /// Repay the entire loan amount with interest
    pub fun repay() {
        // Check if the caller has an active loan
        assert(self.borrowers[self.account], message: "Not a borrower")

        // Retrieve the borrowed amount and start time for the caller
        let amount_ = self.borrowAmount[self.account]!

        // Calculate the time elapsed since borrowing
        let timeElapsed = getCurrentBlock().timestamp - amount_.start

        // Calculate the interest to be paid by the borrower
        let interest = (amount_.amount * timeElapsed * self.borrowRate) / self.totalSupply

        // Calculate the total amount to be repaid (principal + interest)
        let amountWithInterest = amount_.amount + interest

        // Ensure the total amount to be repaid is greater than 0
        assert(amountWithInterest > UFix64(0), message: "Amount cannot be 0")

        // Transfer the repayment amount (principal + interest) from the caller's account to the pool contract
        self.token.transfer(from: self.account, to: self.address, amount: amountWithInterest)

        // Remove the borrower's record and mark them as no longer a borrower
        self.borrowAmount.remove(key: self.account)
        self.borrowers[self.account] = false

        // Update the total supply of the pool by adding the repayment amount
        self.totalSupply = self.totalSupply + amountWithInterest
    }

    /// Withdraw the earned amount for the lender
    pub fun withdraw() {
        // Check if the caller is a lender
        assert(self.lenders[self.account], message: "You are not a lender")

        // Retrieve the lent amount and start time for the caller
        let amount_ = self.lendAmounts[self.account]!

        // Calculate the time elapsed since lending
        let timeElapsed = getCurrentBlock().timestamp - amount_.start

        // Calculate the interest earned by the lender
        let interest = (amount_.amount * timeElapsed * self.lendRate) / self.totalSupply

        // Calculate the total amount to be withdrawn (principal + interest)
        let amountWithInterest = amount_.amount + interest

        // Ensure the total amount to be withdrawn is greater than 0
        assert(amountWithInterest > UFix64(0), message: "Amount cannot be 0")

        // Remove the lender's record and mark them as no longer a lender
        self.lendAmounts.remove(key: self.account)
        self.lenders[self.account] = false

        // Update the total supply of the pool by deducting the withdrawn amount
        self.totalSupply = self.totalSupply - amountWithInterest

        // Transfer the withdrawn amount (principal + interest) from the pool contract to the caller's account
        self.token.transfer(from: self.address, to: self.account, amount: amountWithInterest)
    }
}

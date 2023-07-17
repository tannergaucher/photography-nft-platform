# Photography NFT Platform

## Tech Stack

- [ ] React
- [ ] Solidity
- [ ] Truffle Suite
- [ ] Stripe API

## User Stories

### Artist

- [ ] As the artist, I can upload my prints to the marketplace
- [ ] As the artist, I can set the price of my prints
- [ ] As the artist, I can set the number of prints available
- [ ] As the artist, I earn a royalty fee when my prints are sold on the secondary market, at a rate of bid price - original price / 2
- [ ] As the artist, I act as escrow for prints sold on the secondary market, and accept the transaction when the former owner accepts the bid and mails the print to the artist, at which point the artist accepts the transaction and mails the print to the new owner

### Collector

- [ ] As a collector, I can browse the marketplace
- [ ] As a collector, I can purchase a print in dollars
- [ ] As a collector, I can purchase a print in eth
- [ ] As a collector, I can purchase a print in btc
- [ ] As a collector, I can see my collection of prints
- [ ] As a collector, I can place bids on prints owned by other collectors
- [ ] As a collector, I can reject bids on prints I own
- [ ] As a collector, I can accept bids on prints I own, and earn a profit at a rate of bidPrice - originalPrice / 2

## Contract Architecture

### Print Contract

- ERC 721 token representing a print
- Handles the creation, ownership, and transfer of prints

### Marketplace Contract

Interacts with the print contract. Holds the logic for buying prints from the artist and reselling prints on the secondary market from collector to collector.

- Handles the sale of prints from the artist to the collector
- Handles the sale of prints on the secondary market
- Handles the bidding of prints on the secondary market
- Handles accepting and rejecting bids on the secondary market

### Escrow Contract

The escrow contract interacts with the print contract and the marketplace contract.

The artist acts as an escrow agent. The artist accepts the transaction when the former owner accepts the bid and mails the print to the artist, at which point the artist accepts the transaction and mails the print / transfers ownership to the new owner.

- Escrow contract and print contract

  - When a collector accepts a bid on a print, they initiate the process through the marketplace contract
  - The marketplace contract then instructs the print contract to transfer the print from the collector's address to the escrow contract's address.

- Escrow contract and marketplace contract

  - After the print is sent to the escrow contract, the marketplace contract communicates with the escrow contract to inform the artist / escrow agent, about the pending resale.
  - The escrow agent approves the resale on receiving the print, the marketplace contract is informed

- Escrow contract and the new buyer

  - New buyer sends the payment to the escrow contract
  - Escrow contract sends the royalty payment to the artist
  - Escrow contract sends royalty payment to the former owner
  - Escrow contract transfers print ownership to the new buyer

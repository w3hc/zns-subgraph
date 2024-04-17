import {
  Transfer as TransferEvent,
  Subscribers,
} from "../../generated/Subscribers/Subscribers"
import {
  Subscription,
  Transfer
} from "../../generated/schema"

export function handleTransfer(event: TransferEvent): void {

  // Here we write the handler code for the Transfer entity
  let transfer = new Transfer(event.transaction.hash.concatI32(event.logIndex.toI32()))
  transfer.from = event.params.from
  transfer.to = event.params.to
  transfer.tokenId = event.params.tokenId
  transfer.blockNumber = event.block.number
  transfer.transactionHash = event.transaction.hash
  transfer.save()
  // The transfer entity handler code ends here

  // Here we write the handler code for the Subscription entity
  let contractAddress = Subscribers.bind(event.address);
  let subscription = Subscription.load(event.params.tokenId.toString());

  if (subscription == null) {
    subscription = new Subscription(event.params.tokenId.toString());
    subscription.creator = event.params.to;
    subscription.tokenURI = contractAddress.tokenURI(event.params.tokenId);
  }

  subscription.newOwner = event.params.to;
  subscription.blockNumber = event.block.number;
  subscription.save();
  // The subscription entity handler code ends here
}
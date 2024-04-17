import {
  Transfer as TransferEvent,
  Subscribers,
} from "../../generated/Subscribers/Subscribers"
import {
  NoGasPass,
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

  // Here we write the handler code for the NoGasPass entity
  let contractAddress = Subscribers.bind(event.address);
  let noGasPass = NoGasPass.load(event.params.tokenId.toString());

  if (noGasPass == null) {
    noGasPass = new NoGasPass(event.params.tokenId.toString());
    noGasPass.creator = event.params.to;
    noGasPass.tokenURI = contractAddress.tokenURI(event.params.tokenId);
  }

  noGasPass.newOwner = event.params.to;
  noGasPass.blockNumber = event.block.number;
  noGasPass.save();
  // The noGasPass entity handler code ends here
}
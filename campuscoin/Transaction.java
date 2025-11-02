package campuscoin;

import java.security.PublicKey;
import java.util.Base64;

public class Transaction {
    public final String senderAddress; // sender address (hex)
    public final String receiverAddress;
    public final double amount;
    public final byte[] signature; // signature over (sender+receiver+amount)
    public final byte[] senderPublicKeyBytes; // raw public key bytes so others can verify

    public Transaction(String senderAddress, String receiverAddress, double amount, byte[] signature, byte[] senderPublicKeyBytes) {
        this.senderAddress = senderAddress;
        this.receiverAddress = receiverAddress;
        this.amount = amount;
        this.signature = signature;
        this.senderPublicKeyBytes = senderPublicKeyBytes;
    }

    public String toString() {
        return senderAddress + " -> " + receiverAddress + " : " + amount;
    }

    public byte[] getContentBytes() {
        String content = senderAddress + "|" + receiverAddress + "|" + Double.toString(amount);
        return content.getBytes();
    }

    public String shortSig() {
        return Base64.getEncoder().encodeToString(signature).substring(0, 12);
    }
}

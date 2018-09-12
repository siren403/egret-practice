class AESSerializer implements DataConverter.IAfterSerializer {

    public constructor(
        private secretPassphrase: string
    ) { }

    public serialize(data: string): string {

        let cipherText = null;
        try {
            cipherText = CryptoJS.AES.encrypt(data, this.secretPassphrase).toString();
        } catch (e) {
            debug.log(JSON.stringify(e));
            cipherText = data;
        }
        return cipherText;
    }
    public deserialize(data: string): string {
        let decrypt = null;
        try {
            decrypt = CryptoJS.AES.decrypt(data, this.secretPassphrase).toString(CryptoJS.enc.Utf8);
        } catch (e) {
            debug.log(JSON.stringify(e));
            decrypt = data;
        }
        return decrypt;
    }
}

class LzStringSerializer implements DataConverter.IAfterSerializer {
    public serialize(data: string): string {
        return LZString.compressToEncodedURIComponent(data);
    }
    public deserialize(data: string): string {
        return LZString.decompressFromEncodedURIComponent(data);
    }
}
/**
 * @class App
 */
class App {

    /**
     * constructor
     * @param {string} pin 
     * @param {string} mnemonic 
     */
    constructor(pin,mnemonic){
        this.pin = pin;
        this.mnemonic = mnemonic;
    }

    /**
     * set pin
     * @param {string} value
     */
    set pin (value) {
        this._pin = value;
    }

    /**
     * get pin
     */
    get pin(){
        return this._pin;
    }

    /**
     * set mnemonic
     * @param {string} value
     */
    set mnemonic (value) {
        this._mnemonic = value;
    }

    /**
     * get mnemonic
     */
    get pin(){
        return this._mnemonic;
    }
}
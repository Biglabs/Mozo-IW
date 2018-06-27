class GlobalStorage {
    static myInstance = null;

    static schemeData = null;

    /**
     * @returns {GlobalStorage}
     */
    static getInstance() {
        if (GlobalStorage.myInstance == null) {
            GlobalStorage.myInstance = new GlobalStorage();
        }
        return GlobalStorage.myInstance;
    }

    setSchemeData(data){
        this.schemeData = data;
    }

    getSchemeData(){
        return this.schemeData;
    }
}
export default GlobalStorage;
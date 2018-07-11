class SchemeDataStore {
    static myInstance = null;

    static schemeData = null;

    /**
     * @returns {SchemeDataStore}
     */
    static getInstance() {
        if (SchemeDataStore.myInstance == null) {
            SchemeDataStore.myInstance = new SchemeDataStore();
        }
        return SchemeDataStore.myInstance;
    }

    setSchemeData(data){
        this.schemeData = data;
    }

    getSchemeData(){
        return this.schemeData;
    }
}
export default SchemeDataStore;
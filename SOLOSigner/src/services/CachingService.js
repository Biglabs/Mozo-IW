class CachingService {
    static myInstance = null;

    static schemeData = null;

    static addresses = [];

    /**
     * @returns {CachingService}
     */
    static getInstance() {
        if (CachingService.myInstance == null) {
            CachingService.myInstance = new CachingService();
        }
        return CachingService.myInstance;
    }

    setSchemeData(data){
        this.schemeData = data;
    }

    getSchemeData(){
        return this.schemeData;
    }
}
export default CachingService;
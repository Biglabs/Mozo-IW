import LocalUserReference from "./LocalUserReference";
class DataService {
    static myInstance = null;

    static localStorage = null;

    /**
     * @returns {DataService}
     */
    static getInstance() {
        if (DataService.myInstance == null) {
            DataService.myInstance = new DataService();
            DataService.localStorage = new LocalUserReference();
        }

        return DataService.myInstance;
    }
}

export default DataService;
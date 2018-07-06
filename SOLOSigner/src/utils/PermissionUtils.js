import {PermissionsAndroid, Platform} from 'react-native';

class PermissionsUtils {
    async requestStoragePermission() {
        if (Platform.OS === 'ios') return true;
        else {
            try {
                const permissions = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
                ]);

                let granted = true;
                Object.keys(permissions).map(key => {
                    granted = granted && permissions[key] === PermissionsAndroid.RESULTS.GRANTED;
                });
                return granted;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
    }
}

export default new PermissionsUtils();
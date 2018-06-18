package com.biglabs.solo.signer.library;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.os.Bundle;
import android.os.IBinder;
import android.os.Message;
import android.os.Messenger;
import android.os.RemoteException;

import java.util.List;

class SignerServiceHelper {
    private static SignerServiceHelper instance = null;

    private static final String SIGNER_SERVICE_ACTION = "com.biglabs.solo.signer.service";
    private static final String SIGNER_SERVICE_PACKAGE = "com.biglabs.solo.signer";
    private static final String SIGNER_SERVICE_CLASS = "com.biglabs.solo.signer.SignerService";

    private static final int KEY_GET_BALANCE = 0x01;

    Messenger messenger;
    private Bundle continuousData = null;
    private boolean isServiceConnected = false;

    static synchronized SignerServiceHelper getInstance() {
        if (instance == null) {
            instance = new SignerServiceHelper();
        }
        return instance;
    }

    void send(Context context, Bundle data) {
        if (isServiceConnected && messenger != null) {
            Message message = Message.obtain(null, KEY_GET_BALANCE);
            message.setData(data);
            message.replyTo = new Messenger(new ServiceResponseHandler());
            try {
                messenger.send(message);
            } catch (RemoteException e) {
                Signer.getInstance().onServiceError(e);
            }
        } else {
            continuousData = data;
            start(context);
        }
    }

    void start(final Context context) {
        Intent intent = new Intent(SIGNER_SERVICE_ACTION);
        intent.setClassName(SIGNER_SERVICE_PACKAGE, SIGNER_SERVICE_CLASS);

        if (checkSignerServiceIsAvailable(context, intent)) {
            context.bindService(intent, new ServiceConnection() {
                @Override
                public void onServiceConnected(ComponentName name, IBinder service) {
                    messenger = new Messenger(service);
                    isServiceConnected = true;
                    if (continuousData != null) {
                        send(context, new Bundle(continuousData));
                        continuousData = null;
                    }
                }

                @Override
                public void onServiceDisconnected(ComponentName name) {
                    messenger = null;
                    isServiceConnected = false;
                }
            }, Context.BIND_AUTO_CREATE);
        } else {
            // TODO: 6/18/18 show Alert: Solo Signer not installed yet
        }
    }

    private boolean checkSignerServiceIsAvailable(Context context, Intent intent) {
        List<ResolveInfo> services = context.getPackageManager().queryIntentServices(intent, PackageManager.MATCH_DEFAULT_ONLY);
        return services != null && services.size() > 0;
    }
}

package com.biglabs.solo.signer.library;

import android.os.Handler;
import android.os.Message;

public class ServiceResponseHandler extends Handler {
    @Override
    public void handleMessage(Message msg) {
        super.handleMessage(msg);
        if (msg.getData() != null) {
            Signer.getInstance().onReceivedResponse(msg.getData());
        }
    }
}

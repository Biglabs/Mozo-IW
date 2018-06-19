package com.biglabs.solo.signer;

import android.app.Service;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.os.Messenger;

public class SignerService extends Service {

    private static final int KEY_GET_BALANCE = 0x01;

    private final Messenger messenger;

    public SignerService() {
        messenger = new Messenger(new IncomingHandler());
    }

    @Override
    public IBinder onBind(Intent intent) {
        return messenger.getBinder();
    }

    private static class IncomingHandler extends Handler {

        private void fetchAndResponseBalance(Message msg) {
            try {
                String name = "";
                if (msg.getData() != null) {
                    name = msg.getData().getString("message", name);
                }

                Bundle bundle = new Bundle();
                bundle.putString("balance", "hello " + name);

                Message responseMessage = Message.obtain();
                responseMessage.setData(bundle);

                msg.replyTo.send(responseMessage);

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case KEY_GET_BALANCE:
                    fetchAndResponseBalance(msg);
                    break;
                default:
                    super.handleMessage(msg);
            }
        }
    }
}

package com.biglabs.solo.signer;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.tradle.react.UdpSocketsModule;
import io.realm.react.RealmReactPackage;
import io.realm.react.RealmReactPackage;
import com.tradle.react.UdpSocketsModule;
import com.peel.react.TcpSocketsModule;
import com.horcrux.svg.SvgPackage;
import cl.json.RNSharePackage;
import com.bitgo.randombytes.RandomBytesPackage;
import co.airbitz.fastcrypto.RNFastCryptoPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.peel.react.rnos.RNOSModule;
import com.rnfs.RNFSPackage;
import ui.fileselector.RNFileSelectorPackage;
import org.reactnative.camera.RNCameraPackage;
import ui.fileselector.RNFileSelectorPackage;

import cl.json.RNSharePackage;

import com.rnfs.RNFSPackage;

import cl.json.ShareApplication;
import io.realm.react.RealmReactPackage;

import org.reactnative.camera.RNCameraPackage;

import com.horcrux.svg.SvgPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication, ShareApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.asList(
                    new MainReactPackage(),
            new UdpSocketsModule(),
            new RealmReactPackage(),
            new RealmReactPackage(),
            new UdpSocketsModule(),
            new TcpSocketsModule(),
            new SvgPackage(),
            new RNSharePackage(),
            new RandomBytesPackage(),
            new RNFastCryptoPackage(),
            new RandomBytesPackage(),
            new RNOSModule(),
            new RNFSPackage(),
            new RNFileSelectorPackage(),
            new RNCameraPackage(),
                    new RNFileSelectorPackage(),
                    new RNFSPackage(),
                    new RNSharePackage(),
                    new RealmReactPackage(),
                    new RNCameraPackage(),
                    new SvgPackage(),
                    new RandomBytesPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public String getFileProviderAuthority() {
        return BuildConfig.APPLICATION_ID + ".provider";
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}

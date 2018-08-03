package com.biglabs.solo.signer;

import android.app.Application;

import com.facebook.react.ReactApplication;
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
                new RealmReactPackage(),
                new RNFileSelectorPackage(),
                new RNSharePackage(),
                new RNFSPackage(),
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

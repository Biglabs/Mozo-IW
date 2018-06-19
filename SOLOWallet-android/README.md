Build Solo Signer library
```
./gradlew :solosignerlibrary:assembleRelease
```

Add scheme handle to your `MainActivity`
```
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    
    <data android:scheme="wallet-${applicationId}" />
</intent-filter>
```
Build Solo Signer library
```
./gradlew :library:assembleRelease
```

Add scheme handle to your `MainActivity`
```
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    
    <data android:scheme="${applicationId}.solowallet" />
</intent-filter>
```

Initialize Signer by add this line to `onCreate` method inside `MainActivity` 
```
Signer.initialize(this, BuildConfig.APPLICATION_ID)
```


# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

-keepattributes *Annotation*, InnerClasses
-keep class kotlin.** { *; }
-keep class org.jetbrains.** { *; }
-dontnote kotlinx.serialization.SerializationKt
-keep,includedescriptorclasses class com.biglabs.solo.signer.library.**$$serializer { *; }

-keep class com.biglabs.solo.signer.library.models.* { *; }
-keep class com.biglabs.solo.signer.library.Signer { public *; }
-keep class com.biglabs.solo.signer.library.SignerWrapperActivity { public *; }
-keep public interface com.biglabs.solo.signer.library.* { *; }
-keep public abstract class com.biglabs.solo.signer.library.* { public *; }

# Retrofit2
-dontnote retrofit2.Platform
-dontwarn retrofit2.Platform$Java8
-keepattributes Signature
-keepattributes Exceptions
-dontwarn okio.**

# Gson
-keep class com.google.gson.** { *; }
-keepattributes Signature
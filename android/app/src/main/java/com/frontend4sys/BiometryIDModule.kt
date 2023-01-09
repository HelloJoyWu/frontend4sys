package com.frontend4sys

import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.biometric.BiometricPrompt.PromptInfo
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.*

class BiometryIDModule(reactContext: ReactApplicationContext?) :
        ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "BiometryID"
    }

    companion object {
        const val authenticators = (BiometricManager.Authenticators.BIOMETRIC_STRONG
                or BiometricManager.Authenticators.BIOMETRIC_WEAK
                or BiometricManager.Authenticators.DEVICE_CREDENTIAL)
    }

    @ReactMethod
    fun isSupported(reactErrorCallback: Callback, reactSuccessCallback: Callback) = try {
        val context = reactApplicationContext
        val biometricManager = BiometricManager.from(context)
        val res = biometricManager.canAuthenticate(authenticators)

        if (res == BiometricManager.BIOMETRIC_SUCCESS) {
            reactSuccessCallback.invoke("BIOMETRIC_SUCCESS")
        } else {
            reactErrorCallback.invoke("Not supported.", res.toString())
        }
    } catch (e: Exception) {
        reactErrorCallback.invoke("Failed check supported.", e.toString())
    }

    @ReactMethod
    fun authenticate(reason: String?, reactErrorCallback: Callback, reactSuccessCallback: Callback) {
        UiThreadUtil.runOnUiThread {
            try {
                val context = reactApplicationContext
                val activity = currentActivity
                val biometricManager = BiometricManager.from(context)
                val res = biometricManager.canAuthenticate(authenticators)
                if (res != BiometricManager.BIOMETRIC_SUCCESS) {
                    reactErrorCallback.invoke("Not supported.", res.toString())
                    return@runOnUiThread
                }
                val mainExecutor = ContextCompat.getMainExecutor(context)
                val authenticationCallback: BiometricPrompt.AuthenticationCallback =
                        object : BiometricPrompt.AuthenticationCallback() {
                            override fun onAuthenticationError(
                                    errorCode: Int,
                                    errString: CharSequence
                            ) {
                                super.onAuthenticationError(errorCode, errString)
                                reactErrorCallback.invoke("Biometry authentication failed", errorCode.toString())
                            }

                            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                                super.onAuthenticationSucceeded(result)
                                reactSuccessCallback.invoke("Success")
                            }
                        }
                if (activity != null) {
                    val prompt = BiometricPrompt(
                            (activity as FragmentActivity?)!!,
                            mainExecutor,
                            authenticationCallback
                    )
                    val promptInfo = PromptInfo.Builder()
                            .setAllowedAuthenticators(authenticators)
                            .setTitle(reason!!)
                            .build()
                    prompt.authenticate(promptInfo)
                } else {
                    return@runOnUiThread
                }
            } catch (e: Exception) {
                reactErrorCallback.invoke("Not supported.", e.toString())
            }
        }
    }
}
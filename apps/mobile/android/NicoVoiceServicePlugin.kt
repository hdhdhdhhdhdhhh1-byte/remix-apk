package com.nico.ai

import android.content.Intent
import android.os.Build
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

/**
 * يربط VoiceBackgroundService بجسر جافاسكربت:
 * `Capacitor.Plugins.NicoVoiceService` الذي تقرأه
 * `src/packages/mobile-bridge/capacitor.ts`.
 *
 * سجّله في MainActivity:
 *   registerPlugin(NicoVoiceServicePlugin::class.java)
 */
@CapacitorPlugin(name = "NicoVoiceService")
class NicoVoiceServicePlugin : Plugin() {

    @PluginMethod
    fun start(call: PluginCall) {
        val intent = Intent(context, VoiceBackgroundService::class.java).apply {
            putExtra(VoiceBackgroundService.EXTRA_WAKE_WORD, call.getString("wakeWord"))
            putExtra(VoiceBackgroundService.EXTRA_TEXT, call.getString("foregroundText"))
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(intent)
        } else {
            context.startService(intent)
        }
        call.resolve(JSObject().put("running", true))
    }

    @PluginMethod
    fun stop(call: PluginCall) {
        context.stopService(Intent(context, VoiceBackgroundService::class.java))
        call.resolve()
    }

    @PluginMethod
    fun isRunning(call: PluginCall) {
        call.resolve(JSObject().put("running", VoiceBackgroundService.isRunning))
    }
}

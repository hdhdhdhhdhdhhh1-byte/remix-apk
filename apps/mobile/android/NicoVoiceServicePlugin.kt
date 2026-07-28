package com.nico.ai

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
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

    /**
     * يحوّل كشف كلمة التنبيه في الخدمة إلى حدث `wake` تستمع إليه
     * `src/packages/mobile-bridge/wake.ts` فيبدأ نيكو المحادثة مباشرة.
     */
    private val wakeReceiver = object : BroadcastReceiver() {
        override fun onReceive(ctx: Context?, intent: Intent?) {
            notifyListeners("wake", JSObject().put("wakeWord", intent?.getStringExtra(VoiceBackgroundService.EXTRA_WAKE_WORD)))
        }
    }

    override fun load() {
        val filter = IntentFilter(VoiceBackgroundService.ACTION_WAKE_EVENT)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            context.registerReceiver(wakeReceiver, filter, Context.RECEIVER_NOT_EXPORTED)
        } else {
            context.registerReceiver(wakeReceiver, filter)
        }
    }

    override fun handleOnDestroy() {
        runCatching { context.unregisterReceiver(wakeReceiver) }
        super.handleOnDestroy()
    }

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

package com.nico.ai

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import androidx.core.app.ServiceCompat
import android.app.Service
import android.content.pm.ServiceInfo
import com.nico.ai.R

/**
 * VoiceBackgroundService — يبقي نيكو حاضراً.
 *
 * المهام:
 *  - إدارة جلسة الصوت (بدء / إيقاف / استئناف).
 *  - تشغيل الميكروفون كخدمة أمامية معلنة (microphone foreground service).
 *  - التعامل مع حالة التطبيق (أمامي / خلفي).
 *  - إعادة الاتصال بعد انقطاع الجلسة.
 *  - إدارة الاستماع لكلمة التنبيه "يا نيكو".
 *
 * احترام البطارية:
 *  - لا تبدأ الخدمة إلا بعد تفعيل المستخدم لخيار "الجاهزية الدائمة".
 *  - تتوقف فوراً عند الإيقاف أو إغلاق التطبيق.
 *  - لا استماع مستمر بدون إذن RECORD_AUDIO صريح.
 *
 * محرك كلمة التنبيه غير مضمّن هنا عمداً: `WakeWordEngine` واجهة صغيرة
 * يمكن ربطها لاحقاً بـ Porcupine أو Vosk أو نموذج محلي بدون تغيير باقي الكود.
 */
class VoiceBackgroundService : Service() {

    interface WakeWordEngine {
        fun start(keyword: String, onDetected: () -> Unit)
        fun stop()
    }

    companion object {
        const val CHANNEL_ID = "nico_voice"
        const val NOTIFICATION_ID = 4711
        const val EXTRA_WAKE_WORD = "wake_word"
        const val EXTRA_TEXT = "foreground_text"
        const val ACTION_WAKE = "com.nico.ai.WAKE"
        const val ACTION_WAKE_EVENT = "com.nico.ai.WAKE_EVENT"

        /** يُحقن من الأعلى عند توفر محرك حقيقي. */
        var engine: WakeWordEngine? = null
        var isRunning: Boolean = false
            private set
    }

    private var wakeWord: String = "يا نيكو"

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        wakeWord = intent?.getStringExtra(EXTRA_WAKE_WORD) ?: wakeWord
        val text = intent?.getStringExtra(EXTRA_TEXT) ?: "نيكو جاهز — قل «$wakeWord»"

        createChannel()
        startAsForeground(text)
        isRunning = true

        // إدارة الاستماع: المحرك يوقظ التطبيق ويترك بقية المسار للعقل الموجود.
        engine?.start(wakeWord) { onWakeWordDetected() }

        // إعادة الاتصال: النظام يعيد تشغيل الخدمة إن قتلها لتحرير الذاكرة.
        return START_STICKY
    }

    private fun onWakeWordDetected() {
        // يُعلم طبقة الويب فوراً (إن كان التطبيق حياً) ثم يرفع الواجهة للأمام.
        sendBroadcast(Intent(ACTION_WAKE_EVENT).setPackage(packageName))
        val launch = packageManager.getLaunchIntentForPackage(packageName)?.apply {
            action = ACTION_WAKE
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP)
        }
        if (launch != null) startActivity(launch)
    }

    private fun startAsForeground(text: String) {
        val launch = packageManager.getLaunchIntentForPackage(packageName)
        val pending = PendingIntent.getActivity(
            this, 0, launch, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
        val notification: Notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Nico AI")
            .setContentText(text)
            .setSmallIcon(R.drawable.ic_stat_nico)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setContentIntent(pending)
            .build()

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            ServiceCompat.startForeground(
                this, NOTIFICATION_ID, notification,
                ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE
            )
        } else {
            startForeground(NOTIFICATION_ID, notification)
        }
    }

    private fun createChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        val manager = getSystemService(NotificationManager::class.java)
        if (manager.getNotificationChannel(CHANNEL_ID) != null) return
        manager.createNotificationChannel(
            NotificationChannel(CHANNEL_ID, "Nico Voice", NotificationManager.IMPORTANCE_LOW)
                .apply { description = "جلسة نيكو الصوتية وكلمة التنبيه" }
        )
    }

    override fun onDestroy() {
        engine?.stop()
        isRunning = false
        super.onDestroy()
    }
}

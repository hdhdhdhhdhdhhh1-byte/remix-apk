package com.nico.ai;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.nico.ai.NicoVoiceServicePlugin;

/**
 * انسخ هذا الملف فوق
 * android/app/src/main/java/com/nico/ai/MainActivity.java
 * بعد تنفيذ: npx cap add android
 *
 * وظيفته الوحيدة: تسجيل إضافة خدمة الصوت حتى يصبح
 * Capacitor.Plugins.NicoVoiceService متاحاً للجسر في الويب.
 */
public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    registerPlugin(NicoVoiceServicePlugin.class);
    super.onCreate(savedInstanceState);
  }
}

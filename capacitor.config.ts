import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Nico AI — Android production configuration.
 *
 * Native shell around the existing Nico web app: same NicoBrain, same memory,
 * same Supabase backend, same voice routes.
 *
 * For development hot-reload against the Lovable preview, uncomment the
 * `server` block below and set `cleartext: true`. For a release APK/AAB,
 * leave `server` OUT (the default here) and run:
 *
 *   bun run build && npx cap sync android
 *   cd apps/mobile/android && ./gradlew bundleRelease   # AAB for Play
 *   ./gradlew assembleRelease                            # APK for sideload
 */
const config: CapacitorConfig = {
  appId: "com.nico.ai",
  appName: "Nico AI",
  webDir: ".output/public",
  // server: {
  //   url: "https://<your-preview>.lovable.app?forceHideBadge=true",
  //   cleartext: true,
  // },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: "#070B18",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
    LocalNotifications: {
      smallIcon: "ic_stat_nico",
      iconColor: "#4F6BFF",
    },
  },
};

export default config;

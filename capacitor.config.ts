import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Nico AI — Android build configuration.
 *
 * The Android app is a native shell around the existing Nico web app: same
 * NicoBrain, same memory, same Supabase backend, same voice routes.
 *
 * `server.url` points at the Lovable preview so the app hot-reloads during
 * development. For a production APK/AAB, remove the whole `server` block and
 * run `bun run build && npx cap sync android` so the bundle in `dist/` ships
 * inside the app.
 */
const config: CapacitorConfig = {
  appId: "com.nico.ai",
  appName: "Nico AI",
  webDir: "dist",
  server: {
    url: "https://id-preview--5f79548d-5fe4-4452-8652-86575bd3d177.lovable.app?forceHideBadge=true",
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
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

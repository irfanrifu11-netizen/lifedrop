import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.lifedrop.bloodnetwork",
  appName: "LifeDrop",
  webDir: ".next-native",
  server: {
    androidScheme: "https",
  },
};

export default config;

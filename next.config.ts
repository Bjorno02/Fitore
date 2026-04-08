import type { NextConfig } from "next";

import os from "os"

const isWSL = process.env.WSL_DISTRO_NAME !== undefined

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg"],
  // WSL2: move .next to native Linux FS so Turbopack's flock() works
  ...(isWSL && { distDir: `${os.tmpdir()}/martialops-next` }),
};

export default nextConfig;

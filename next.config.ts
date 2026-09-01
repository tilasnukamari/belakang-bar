import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ada package-lock.json lain di folder induk (C:\private\risma). Tanpa ini Next
  // menebak root workspace ke sana dan salah menelusuri berkas saat build.
  outputFileTracingRoot: path.resolve(process.cwd()),
};

export default nextConfig;

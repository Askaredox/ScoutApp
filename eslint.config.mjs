import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const ignores = ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"];
const nextConfig =[
  {
    ignores: ignores,
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
];

export default nextConfig;
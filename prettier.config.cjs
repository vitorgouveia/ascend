/** @type {import('prettier').Config} */
module.exports = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  pluginSearchDirs: false,
  printWidth: 80,
  tabWidth: 2,
  trailingComma: "es5",
  semi: false,
  bracketSameLine: false,
  tailwindConfig: "./tailwind.config.ts",
}
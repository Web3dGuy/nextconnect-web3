export const ENTRYPOINT_ADDRESS_V07 =
  "0x0000000071727De22E5E9d8BAf0edAc6f37da032" as const;

export const ENTRYPOINT_ADDRESS_V06 =
  "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789" as const;

/**
 * Custom account factory address. If not set, permissionless.js uses its own
 * canonical pre-deployed factory for the chosen EntryPoint version:
 *   v0.7 → 0x91E60e0613810449d098b0b5Ec8b51A0FE8c8985
 *   v0.6 → 0x9406Cc6185a346906296840746125a0E44976454
 */
export const FACTORY_ADDRESS = ((): `0x${string}` | undefined => {
  const raw = process.env.NEXT_PUBLIC_FACTORY_ADDRESS;
  if (!raw) return undefined;
  if (!/^0x[0-9a-fA-F]{40}$/.test(raw)) {
    console.error("[NextConnect] Invalid FACTORY_ADDRESS, ignoring:", raw);
    return undefined;
  }
  return raw as `0x${string}`;
})();

export const BUNDLER_URL =
  process.env.NEXT_PUBLIC_BUNDLER_URL ?? "";

export const PAYMASTER_URL =
  process.env.NEXT_PUBLIC_PAYMASTER_URL ?? "";

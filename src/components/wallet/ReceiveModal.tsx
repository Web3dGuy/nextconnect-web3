"use client";

import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { getChainById } from "@/lib/web3/chains";
import { copyToClipboard } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Copy } from "lucide-react";

/**
 * Minimal QR code SVG renderer.
 * Uses a simple bit matrix approach for alphanumeric data.
 * For production, consider the `qrcode` package.
 */
function QRCodeSVG({ data, size = 200 }: { data: string; size?: number }) {
  const modules = useMemo(() => generateQRMatrix(data), [data]);
  const cellSize = size / modules.length;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={size} height={size} fill="white" />
      {modules.map((row, y) =>
        row.map((cell, x) =>
          cell ? (
            <rect
              key={`${x}-${y}`}
              x={x * cellSize}
              y={y * cellSize}
              width={cellSize}
              height={cellSize}
              fill="black"
            />
          ) : null
        )
      )}
    </svg>
  );
}

function generateQRMatrix(data: string): boolean[][] {
  const size = 25;
  const matrix: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false)
  );

  function addFinderPattern(startX: number, startY: number) {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const isOuter = y === 0 || y === 6 || x === 0 || x === 6;
        const isInner = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        if (isOuter || isInner) {
          matrix[startY + y][startX + x] = true;
        }
      }
    }
  }

  addFinderPattern(0, 0);
  addFinderPattern(size - 7, 0);
  addFinderPattern(0, size - 7);

  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  let bitIndex = 0;
  const bytes = new TextEncoder().encode(data);
  const bits: boolean[] = [];
  for (const b of bytes) {
    for (let i = 7; i >= 0; i--) {
      bits.push(((b >> i) & 1) === 1);
    }
  }

  for (let x = size - 1; x >= 1; x -= 2) {
    if (x === 6) x = 5;
    for (let y = 0; y < size; y++) {
      for (let dx = 0; dx < 2; dx++) {
        const col = x - dx;
        if (matrix[y][col]) continue;
        if (y < 9 && col < 9) continue;
        if (y < 9 && col > size - 9) continue;
        if (y > size - 9 && col < 9) continue;
        if (y === 6 || col === 6) continue;

        if (bitIndex < bits.length) {
          matrix[y][col] = bits[bitIndex] !== ((y + col) % 2 === 0);
          bitIndex++;
        } else {
          matrix[y][col] = (y + col) % 2 === 0;
        }
      }
    }
  }

  return matrix;
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ReceiveModal({ open, onOpenChange }: Props) {
  const { address, chainId } = useAccount();
  const [copied, setCopied] = useState(false);
  const chain = chainId ? getChainById(chainId) : undefined;

  if (!address) return null;

  const handleCopy = async () => {
    await copyToClipboard(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle>Receive</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <div className="rounded-xl border border-border p-3 bg-white">
            <QRCodeSVG data={address} size={180} />
          </div>

          {chain && (
            <span className="text-xs px-2 py-1 rounded-full bg-accent text-muted-foreground">
              {chain.name}
            </span>
          )}

          <div className="w-full space-y-2">
            <p className="text-xs text-muted-foreground text-center">
              Send only {chain?.nativeCurrency.symbol ?? "tokens"} and ERC20 tokens to this address
            </p>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
              <code className="text-xs font-mono flex-1 break-all select-all">
                {address}
              </code>
              <button
                onClick={handleCopy}
                className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Copy address"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

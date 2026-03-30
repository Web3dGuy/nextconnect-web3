import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function icon(props: IconProps, defaultSize = 20) {
  const { size = defaultSize, width, height, ...rest } = props;
  return { width: width ?? size, height: height ?? size, ...rest };
}

export function MetaMaskIcon(props: IconProps) {
  const p = icon(props);
  return (
    <svg viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
      <path d="M32.96 1L19.7 10.87l2.45-5.82L32.96 1Z" fill="#E17726" stroke="#E17726" strokeWidth=".25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.04 1l13.14 9.96-2.33-5.91L2.04 1ZM28.18 23.73l-3.53 5.41 7.56 2.08 2.17-7.36-6.2-.13ZM.64 23.86l2.15 7.36 7.55-2.08-3.52-5.41-6.18.13Z" fill="#E27625" stroke="#E27625" strokeWidth=".25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.96 14.53l-2.12 3.2 7.53.34-.26-8.1-5.15 4.56ZM25.04 14.53l-5.23-4.64-.17 8.18 7.52-.34-2.12-3.2ZM10.34 29.14l4.55-2.2-3.93-3.07-.62 5.27ZM20.11 26.94l4.53 2.2-.6-5.27-3.93 3.07Z" fill="#E27625" stroke="#E27625" strokeWidth=".25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24.64 29.14l-4.53-2.2.36 2.94-.04 1.24 4.21-1.98ZM10.34 29.14l4.22 1.98-.03-1.24.35-2.94-4.54 2.2Z" fill="#D5BFB2" stroke="#D5BFB2" strokeWidth=".25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.64 21.86l-3.79-1.12 2.68-1.23 1.11 2.35ZM20.36 21.86l1.11-2.35 2.69 1.23-3.8 1.12Z" fill="#233447" stroke="#233447" strokeWidth=".25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.34 29.14l.65-5.41-4.17.13 3.52 5.28ZM24.01 23.73l.63 5.41 3.54-5.28-4.17-.13ZM27.16 17.73l-7.52.34.7 3.79 1.11-2.35 2.69 1.23 3.02-3.01ZM10.85 20.74l2.68-1.23 1.11 2.35.7-3.79-7.5-.34 2.99 3.01Z" fill="#CC6228" stroke="#CC6228" strokeWidth=".25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.84 17.73l3.1 6.05-.1-3.04-3-3.01ZM24.14 20.74l-.12 3.04 3.14-6.05-3.02 3.01ZM15.34 18.07l-.7 3.79.88 4.54.2-5.98-.38-2.35ZM19.64 18.07l-.37 2.34.18 5.99.88-4.54-.7-3.79Z" fill="#E27525" stroke="#E27525" strokeWidth=".25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.34 21.86l-.88 4.54.63.44 3.93-3.07.12-3.04-3.8 1.13ZM10.85 20.74l.1 3.04 3.93 3.07.63-.44-.88-4.54-3.78-1.13Z" fill="#F5841F" stroke="#F5841F" strokeWidth=".25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.43 31.12l.04-1.24-.34-.3h-5.26l-.33.3.03 1.24-4.23-1.98 1.48 1.21 3 2.08h5.36l3.01-2.08 1.47-1.21-4.23 1.98Z" fill="#C0AC9D" stroke="#C0AC9D" strokeWidth=".25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.11 26.94l-.63-.44h-3.96l-.63.44-.35 2.94.33-.3h5.26l.34.3-.36-2.94Z" fill="#161616" stroke="#161616" strokeWidth=".25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M33.52 11.35l1.12-5.45L32.96 1l-12.85 9.55 4.93 4.18 6.97 2.04 1.54-1.8-.67-.48 1.06-.97-.82-.63 1.07-.82-.7-.54ZM.36 5.9l1.14 5.45-.73.54 1.07.82-.81.63 1.06.97-.68.48 1.54 1.8 6.97-2.04 4.93-4.18L2.04 1 .36 5.9Z" fill="#763E1A" stroke="#763E1A" strokeWidth=".25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32.01 16.77l-6.97-2.04 2.12 3.2-3.14 6.05 4.14-.05h6.2l-2.35-7.16ZM9.96 14.73l-6.97 2.04-2.33 7.16h6.18l4.14.05-3.12-6.05 2.1-3.2ZM19.64 18.07l.44-7.72 2.04-5.51H12.88l2.02 5.51.46 7.72.17 2.36.01 5.97h3.96l.02-5.97.13-2.36Z" fill="#F5841F" stroke="#F5841F" strokeWidth=".25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CoinbaseIcon(props: IconProps) {
  const p = icon(props);
  return (
    <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
      <rect width="28" height="28" rx="6" fill="#0052FF" />
      <path fillRule="evenodd" clipRule="evenodd" d="M14 23.8c5.412 0 9.8-4.388 9.8-9.8S19.412 4.2 14 4.2 4.2 8.588 4.2 14s4.388 9.8 9.8 9.8Zm-3.15-12.25a1.05 1.05 0 0 1 1.05-1.05h4.2a1.05 1.05 0 0 1 1.05 1.05v4.9a1.05 1.05 0 0 1-1.05 1.05h-4.2a1.05 1.05 0 0 1-1.05-1.05v-4.9Z" fill="#fff" />
    </svg>
  );
}

export function WalletConnectIcon(props: IconProps) {
  const p = icon(props);
  return (
    <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
      <rect width="28" height="28" rx="6" fill="#3B99FC" />
      <path d="M9.27 11.28c2.61-2.56 6.85-2.56 9.46 0l.31.31a.32.32 0 0 1 0 .46l-1.08 1.05a.17.17 0 0 1-.24 0l-.43-.42a4.6 4.6 0 0 0-6.6 0l-.46.45a.17.17 0 0 1-.24 0L8.91 12.1a.32.32 0 0 1 0-.46l.36-.36Zm11.69 2.17 .96.94a.32.32 0 0 1 0 .46l-4.34 4.25a.34.34 0 0 1-.47 0l-3.08-3.02a.09.09 0 0 0-.12 0l-3.08 3.02a.34.34 0 0 1-.47 0L6.02 14.85a.32.32 0 0 1 0-.46l.96-.94a.34.34 0 0 1 .47 0l3.08 3.02a.09.09 0 0 0 .12 0l3.08-3.02a.34.34 0 0 1 .47 0l3.08 3.02a.09.09 0 0 0 .12 0l3.08-3.02a.34.34 0 0 1 .48 0Z" fill="#fff" />
    </svg>
  );
}

export function GoogleIcon(props: IconProps) {
  const p = icon(props);
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...p}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
      <path d="M5.84 14.09A6.97 6.97 0 0 1 5.47 12c0-.72.13-1.43.37-2.09V7.07H2.18A11.97 11.97 0 0 0 .94 12c0 1.94.46 3.77 1.24 5.33l3.66-3.24Z" fill="#FBBC05" />
      <path d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.07l3.66 2.84c.87-2.6 3.3-4.16 6.16-4.16Z" fill="#EA4335" />
    </svg>
  );
}

export function AppleIcon(props: IconProps) {
  const p = icon(props);
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...p}>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-2.11 4.45-3.74 4.25Z" fill="currentColor" />
    </svg>
  );
}

export function DiscordIcon(props: IconProps) {
  const p = icon(props);
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...p}>
      <path d="M20.32 4.37A19.8 19.8 0 0 0 15.43 3c-.21.38-.46.89-.63 1.29a18.42 18.42 0 0 0-5.58 0A13.2 13.2 0 0 0 8.58 3a19.7 19.7 0 0 0-4.9 1.38C.53 9.62-.33 14.74.1 19.78A19.86 19.86 0 0 0 6.18 22c.49-.67.92-1.38 1.29-2.12a12.88 12.88 0 0 1-2.03-.98c.17-.12.34-.26.5-.39a14.17 14.17 0 0 0 12.13 0c.16.14.33.27.5.4-.65.39-1.33.71-2.04.98.37.74.8 1.45 1.29 2.12a19.8 19.8 0 0 0 6.08-3.23c.52-5.52-.88-10.59-3.58-14.42ZM8.01 16.71c-1.25 0-2.28-1.15-2.28-2.55 0-1.41 1-2.56 2.28-2.56s2.3 1.15 2.28 2.56c0 1.4-1.01 2.55-2.28 2.55Zm8 0c-1.25 0-2.28-1.15-2.28-2.55 0-1.41 1-2.56 2.28-2.56s2.3 1.15 2.28 2.56c0 1.4-1 2.55-2.28 2.55Z" fill="#5865F2" />
    </svg>
  );
}

export function GitHubIcon(props: IconProps) {
  const p = icon(props);
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...p}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.43 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.28-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.02 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.22.7.82.58A12.01 12.01 0 0 0 24 12c0-6.63-5.37-12-12-12Z" fill="currentColor" />
    </svg>
  );
}

export function TwitterIcon(props: IconProps) {
  const p = icon(props);
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...p}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" fill="currentColor" />
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  const p = icon(props);
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...p}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  const p = icon(props);
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...p}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2" />
    </svg>
  );
}

export function RedditIcon(props: IconProps) {
  const p = icon(props);
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...p}>
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 0-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" fill="#FF4500" />
    </svg>
  );
}

export function TwitchIcon(props: IconProps) {
  const p = icon(props);
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...p}>
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" fill="#9146FF" />
    </svg>
  );
}

export function FarcasterIcon(props: IconProps) {
  const p = icon(props);
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...p}>
      <path d="M18.24 3H5.76A2.76 2.76 0 0 0 3 5.76v12.48A2.76 2.76 0 0 0 5.76 21h12.48A2.76 2.76 0 0 0 21 18.24V5.76A2.76 2.76 0 0 0 18.24 3zM8.4 17.4V8.28l3.6 4.68 3.6-4.68v9.12h-1.68v-5.52l-1.92 2.52-1.92-2.52v5.52z" fill="#8465CB" />
    </svg>
  );
}

export function LineIcon(props: IconProps) {
  const p = icon(props);
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...p}>
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386a.63.63 0 0 1-.63-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596a.625.625 0 0 1-.707-.18l-2.461-3.349v2.932a.63.63 0 0 1-1.26 0V8.108a.631.631 0 0 1 1.139-.379l2.46 3.35V8.108c0-.345.282-.63.63-.63.349 0 .631.285.631.63v4.771zm-5.741 0a.63.63 0 0 1-1.26 0V8.108c0-.345.282-.63.63-.63.349 0 .63.285.63.63v4.771zm-2.466.629H4.917a.63.63 0 0 1-.63-.629V8.108c0-.345.282-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.63.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" fill="#06C755" />
    </svg>
  );
}

export function KakaoIcon(props: IconProps) {
  const p = icon(props);
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...p}>
      <path d="M12 3c-5.523 0-10 3.59-10 8.013 0 2.86 1.895 5.37 4.735 6.772-.148.532-.952 3.42-.981 3.636 0 0-.02.166.088.229.108.063.235.03.235.03.31-.043 3.592-2.353 4.157-2.76.567.08 1.15.12 1.746.12 5.523 0 10-3.59 10-8.027C22 6.59 17.523 3 12 3" fill="#FEE500" />
    </svg>
  );
}

export function EmailIcon(props: IconProps) {
  const p = icon(props);
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
      <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 7l8.165 5.715a3 3 0 0 0 3.67 0L22 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function WalletIcon(props: IconProps) {
  const p = icon(props);
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
      <rect x="2" y="5" width="20" height="15" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="14.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

const ICON_MAP: Record<string, React.FC<IconProps>> = {
  "io.metamask": MetaMaskIcon,
  metaMaskSDK: MetaMaskIcon,
  metamask: MetaMaskIcon,
  "com.coinbase.wallet": CoinbaseIcon,
  coinbaseWalletSDK: CoinbaseIcon,
  walletConnect: WalletConnectIcon,
  "web3auth-google": GoogleIcon,
  "web3auth-apple": AppleIcon,
  "web3auth-discord": DiscordIcon,
  "web3auth-github": GitHubIcon,
  "web3auth-twitter": TwitterIcon,
  "web3auth-linkedin": LinkedInIcon,
  "web3auth-facebook": FacebookIcon,
  "web3auth-reddit": RedditIcon,
  "web3auth-twitch": TwitchIcon,
  "web3auth-farcaster": FarcasterIcon,
  "web3auth-line": LineIcon,
  "web3auth-kakao": KakaoIcon,
  "web3auth-email": EmailIcon,
};

export function getConnectorIcon(connectorId: string): React.FC<IconProps> {
  return ICON_MAP[connectorId] ?? WalletIcon;
}

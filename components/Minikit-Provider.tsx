'use client'

import { ReactNode, useEffect } from "react";
import { MiniKit } from '@worldcoin/minikit-js';

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // passing appId in the install is optioinal
    // but allows you to access it later via 'window.MiniKit.appId'
    MiniKit.install();
  }, []);

  return <>{children}</>;
}




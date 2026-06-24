"use client";

import { useEffect } from "react";
import { attachCopyProtection } from "@/lib/copyProtection";

/** Site-wide soft copy protection — SEO-safe, forms remain selectable. */
export default function CopyProtection() {
  useEffect(() => attachCopyProtection(), []);
  return null;
}

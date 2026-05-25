"use client";

import { useState } from "react";
import Image from "next/image";
import { LOGIN_PANEL } from "@/data/loginPage";

export default function LoginVisualPanel() {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <section className="home1-login-visual" aria-hidden="true">
      <div className="home1-login-visual-media">
        {!imgFailed ? (
          <Image
            src={LOGIN_PANEL.image}
            alt={LOGIN_PANEL.imageAlt}
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="home1-login-visual-fallback" />
        )}
      </div>
    </section>
  );
}

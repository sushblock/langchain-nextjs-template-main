"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("021ca086-50ea-430a-a2c9-5008c2b449eb");
  }, []);

  return null;
};

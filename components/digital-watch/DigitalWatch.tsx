"use client";
import { useState, useEffect, memo } from "react";

// memo prevents re-renders from propagating up to Header
const DigitalWatch = memo(function DigitalWatch() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
  );

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return <span style={{ fontVariantNumeric: "tabular-nums" }}>{time}</span>;
});

export default DigitalWatch;

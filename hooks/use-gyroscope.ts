"use client";
import { useState, useEffect } from "react";

export function useGyroscope() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isEnabled, setIsEnabled] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<"default" | "granted" | "denied">("default");
  const [hasInitialized, setHasInitialized] = useState(false);

  // Carrega a preferência do cache ao iniciar
  useEffect(() => {
    const savedStatus = localStorage.getItem("slz_gyro_enabled");
    const savedPermission = localStorage.getItem("slz_gyro_permission") as any;

    if (savedStatus === "true") setIsEnabled(true);
    if (savedPermission) setPermissionStatus(savedPermission);
    setHasInitialized(true);
  }, []);

  // Salva a preferência sempre que mudar
  useEffect(() => {
    if (hasInitialized) {
      localStorage.setItem("slz_gyro_enabled", isEnabled.toString());
      localStorage.setItem("slz_gyro_permission", permissionStatus);
    }
  }, [isEnabled, permissionStatus, hasInitialized]);

  const requestPermission = async () => {
    // @ts-ignore
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      try {
        // @ts-ignore
        const permission = await DeviceOrientationEvent.requestPermission();
        setPermissionStatus(permission);
        if (permission === "granted") {
          setIsEnabled(true);
          return true;
        }
      } catch (error) {
        setPermissionStatus("denied");
      }
    } else {
      // Android / Desktop
      setPermissionStatus("granted");
      setIsEnabled(true);
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (!isEnabled || permissionStatus !== "granted") return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const x = e.beta ? -(e.beta - 45) / 45 : 0;
      const y = e.gamma ? e.gamma / 45 : 0;
      setCoords({ x, y });
    };

    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, [isEnabled, permissionStatus]);

  return { coords, isEnabled, setIsEnabled, permissionStatus, requestPermission, hasInitialized };
}
"use client";

import { useEffect, useRef } from "react";
import { useJourney } from "@/context/JourneyContext";
import { JourneyDetail } from "@/types";

export default function JourneyInitializer({ journey }: { journey: JourneyDetail }) {
    const { setJourneyData } = useJourney();
    const initialized = useRef(false);

    useEffect(() => {
        // 當這個元件收到新的 journey 資料時，立刻更新 Context
        // 使用 JSON.stringify 比對避免無窮迴圈 (簡單防呆)
        if (journey) {
            console.log("[JourneyInitializer] 將 API 真資料注入 Context:", journey.title);
            setJourneyData(journey);
        }
        // Cleanup: 當離開這個 Layout 時，清空 API 資料，避免汙染其他頁面
        return () => {
            setJourneyData(null);
        };
    }, [journey, setJourneyData]);

    return null; // 這個元件不渲染任何畫面
}
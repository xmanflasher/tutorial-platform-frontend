// src/lib/factories.ts
import { JourneyDetail } from "@/types";

// 專門用來生產 "Empty" 或 "Default" 的物件
export function createEmptyJourney(slug: string, title: string = "", description: string = ""): JourneyDetail {
    return {
        id: 0,
        slug: slug || "",
        title: title,
        subtitle: "",
        description: description,
        menus: [],
        missions: [],
        //badges: [],
        //level: 0,
        //currentExp: 0,
        //maxExp: 0,
        totalVideos: 0,
        actionButtons: { primary: "", secondary: "" },
        tags: [],
        chapters: [],
        gyms: [],
        features: [],
        price: 0
    };
}
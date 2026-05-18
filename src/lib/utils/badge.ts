/**
 * 根據 Journey ID 與圖片檔名生成徽章的完整路徑
 * 遵循路徑規範: /images/badges/journey-{id}/{filename}
 * 
 * @param journeyId 課程 ID
 * @param imageUrl 圖片檔名或原始路徑
 * @returns 格式化後的 URL 路徑
 */
export function getBadgeImageUrl(journeyId: number, imageUrl: string | undefined): string {
    if (!imageUrl) return '';
    
    // 如果已經是完整 URL 或相對路徑(包含 /images/badges/)，則直接返回
    if (imageUrl.startsWith('http') || imageUrl.startsWith('/images/badges/journey-')) {
        return imageUrl;
    }

    // 處理舊格式 (如 /images/badges/js-arrow.png)
    if (imageUrl.startsWith('/images/badges/')) {
        const filename = imageUrl.split('/').pop();
        return `/images/badges/journey-${journeyId}/${filename}`;
    }

    // 處理極舊格式 (如 /badges/js-arrow.png)
    if (imageUrl.startsWith('/badges/')) {
        const filename = imageUrl.split('/').pop();
        return `/images/badges/journey-${journeyId}/${filename}`;
    }

    // 新格式：僅檔名 (如 bronze.png)
    return `/images/badges/journey-${journeyId}/${imageUrl}`;
}

import { JourneyDetail, Course } from '@/types';

/**
 * 將後端 JourneyDetail 轉換為前端首頁用的 Course
 */
export const toFeaturedCourse = (journey: JourneyDetail): Course => {
    console.log('[Adapter] Mapping journey:', journey.slug, 'title:', journey.title);
    return {
        id: journey.id,
        title: journey.title,
        subtitle: journey.subtitle || (journey.description ? journey.description.slice(0, 30) + '...' : ''),
        author: journey.instructorName || 'Σ-Codeatl 導師',
        // [Best Practice] Lean Props: 僅傳遞必要的描述字數，減輕 RSC Payload
        description: journey.description ? journey.description.slice(0, 150) + '...' : '',
        slug: journey.slug,
        // 圖片邏輯：統一由 ID 對應，例如 ID 6 對應 course_6.png
        image: `/images/course_${journey.id}.png`,
        tags: journey.tags || [],
        statusLabel: '尚未擁有',
        //couponText: 'ALWAYS SHOW',
        primaryAction: {
            text: '試聽課程',
            href: `/journeys/${journey.slug}`,
            style: 'solid'
        },
        secondaryAction: {
            text: '立刻購買',
            href: `/journeys/${journey.slug}/orders`,
            style: 'outline'
        }
    };
};
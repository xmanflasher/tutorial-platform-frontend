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
        author: '水球潘', // 假設後端沒給
        description: 'DEBUG: BUY - ' + journey.description,
        slug: journey.slug,
        // 圖片邏輯封裝在這裡
        image: journey.slug.includes('ai') ? '/images/course_4.png' : '/images/course_0.png',
        tags: journey.tags || [],
        statusLabel: '尚未擁有',
        couponText: 'ALWAYS SHOW',
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
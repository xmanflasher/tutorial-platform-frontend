const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_PATH = path.join(__dirname, '../public/visual_design/Quetzalcoatl_cute.png');
const OUTPUT_DIR = path.join(__dirname, '../public/brand');

const THEME = {
    bg_start: '#6c209eff', // 紫色
    bg_end: '#F59E0B', // 琥珀色
    shadow: 'rgba(0,0,0,0.5)',
};

async function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/**
 * 強力去背：將 RGB > 245 的像素轉為透明
 */
async function getTransparentBase(buffer) {
    const { data, info } = await sharp(buffer)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    for (let i = 0; i < data.length; i += info.channels) {
        if (data[i] > 245 && data[i + 1] > 245 && data[i + 2] > 245) {
            data[i + 3] = 0; // Alpha = 0
        }
    }
    // 必須轉回 PNG 格式的 Buffer，後續才能重複載入
    return await sharp(data, { raw: info }).png().toBuffer();
}

async function processAssets() {
    console.log('✨ 正在進行 Premium 視覺資產處理 (v2.1)...');
    await ensureDir(OUTPUT_DIR);

    try {
        const inputBuffer = fs.readFileSync(INPUT_PATH);
        // 先執行去背與裁切
        const transparentPngBuffer = await getTransparentBase(inputBuffer);
        const trimmedBuffer = await sharp(transparentPngBuffer).trim().png().toBuffer();
        
        const trimMeta = await sharp(trimmedBuffer).metadata();
        console.log(`去背並 Trim 後的角色尺寸: ${trimMeta.width}x${trimMeta.height}`);

        // 動態推算大頭貼 (取正上方區域，以寬度為基準做正方形)
        const headSize = Math.min(trimMeta.width, trimMeta.height) * 0.6;
        const headBox = {
            left: Math.floor((trimMeta.width - headSize) / 2),
            top: 0,
            width: Math.floor(headSize),
            height: Math.floor(headSize)
        };

        const headBuffer = await sharp(trimmedBuffer)
            .extract(headBox)
            .toBuffer();

        // 動態推算半身像 (取上半 75%)
        const halfBox = {
            left: 0,
            top: 0,
            width: trimMeta.width,
            height: Math.floor(trimMeta.height * 0.75)
        };

        const halfBuffer = await sharp(trimmedBuffer)
            .extract(halfBox)
            .toBuffer();

        // 1. Spirit Guide (256px 透明底) - 改用半身像
        await sharp(halfBuffer)
            .resize(256, 256, { fit: 'inside' })
            .toFile(path.join(OUTPUT_DIR, 'spirit.png'));
        console.log('✅ 已生成: spirit.png');

        // 2. App Icon (1024px 漸層背景 + 角色 + 陰影)
        const gradientBg = Buffer.from(`
            <svg width="1024" height="1024">
                <defs>
                    <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" style="stop-color:${THEME.bg_end};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:${THEME.bg_start};stop-opacity:1" />
                    </radialGradient>
                </defs>
                <rect width="1024" height="1024" fill="url(#grad1)" />
            </svg>
        `);

        // 縮小角色以配合 Icon 構圖
        const charResized = await sharp(trimmedBuffer).resize(750, 750, { fit: 'inside' }).toBuffer();

        await sharp(gradientBg)
            .composite([{
                input: charResized,
                gravity: 'center'
            }])
            .toFile(path.join(OUTPUT_DIR, 'app-icon.png'));
        console.log('✅ 已生成: app-icon.png (漸層版)');

        // 3. Circle Icon (128px 圓形裁切)
        const circleMask = Buffer.from(
            '<svg><circle cx="64" cy="64" r="64" fill="white"/></svg>'
        );
        await sharp({
            create: { width: 128, height: 128, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
        })
            .composite([
                { input: await sharp(headBuffer).resize(110, 110, { fit: 'contain' }).toBuffer(), gravity: 'center' },
                { input: circleMask, blend: 'dest-in' }
            ])
            .toFile(path.join(OUTPUT_DIR, 'icon-circle.png'));
        console.log('✅ 已生成: icon-circle.png (大頭貼版)');

        // 4. Portfolio Cover (400x300)
        await sharp(gradientBg)
            .resize(400, 300)
            .composite([{
                input: await sharp(trimmedBuffer).resize(200, 200).toBuffer(),
                gravity: 'center'
            }])
            .toFile(path.join(OUTPUT_DIR, 'portfolio-cover.png'));
        console.log('✅ 已生成: portfolio-cover.png');

        console.log('\n🌟 升級版資產 v2.1 處理完畢！');

    } catch (err) {
        console.error('❌ 處理失敗:', err);
    }
}

processAssets();

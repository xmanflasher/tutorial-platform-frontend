import os
import sys
from PIL import Image

def convert_spritesheet_to_gif(image_path, output_path, grid_size=(5, 5), duration=100):
    """
    將 5x5 的 Spritesheet 轉換為透明的 GIF。
    
    :param image_path: 來源 PNG 路徑
    :param output_path: 輸出 GIF 路徑
    :param grid_size: (cols, rows) 預設 (5, 5)
    :param duration: 每影格延遲時間 (ms)
    """
    print(f"正在處理: {image_path}")
    img = Image.open(image_path)
    
    # 確保是 RGBA 格式以保留透明度
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
        
    width, height = img.size
    cols, rows = grid_size
    frame_width = width // cols
    frame_height = height // rows
    
    frames = []
    
    for r in range(rows):
        for c in range(cols):
            box = (c * frame_width, r * frame_height, (c + 1) * frame_width, (r + 1) * frame_height)
            frame = img.crop(box)
            
            # 檢查影格是否全透明，如果是，可能可以跳過 (但這裡我們保留所有影格)
            frames.append(frame)
            
    if not frames:
        print("未提取到任何影格！")
        return
        
    # GIF 處理透明度的關鍵：
    # 1. 將 RGBA 轉為 P (Palette) 模式，並指定透明色。
    # 2. 或者在 save 時使用 disposal=2 (Restore to background)，避免影格疊加。
    
    # 我們採用 disposal=2 的方式，並保留 RGBA 幀（Pillow 在儲存為 GIF 時會自動處理）
    # 但為了更好的相容性，我們可以手動處理透明調色盤。
    
    processed_frames = []
    for f in frames:
        # 建立一個有透明通道的 P 模式影像
        # 這裡使用一個技巧：先取得 alpha 通道
        alpha = f.getchannel('A')
        
        # 轉成 P 模式，保留 255 個顏色
        p_frame = f.convert('P', palette=Image.ADAPTIVE, colors=255)
        
        # 將透明度小於 128 的像素設為透明索引 (255)
        mask = Image.eval(alpha, lambda a: 255 if a < 128 else 0)
        p_frame.paste(255, mask)
        
        processed_frames.append(p_frame)

    # 儲存為 GIF
    processed_frames[0].save(
        output_path,
        save_all=True,
        append_images=processed_frames[1:],
        duration=duration,
        loop=0,
        transparency=255, # 指定索引 255 為透明
        disposal=2        # 清除上一影格，避免重疊 (Halo 效應)
    )
    print(f"成功生成透明 GIF: {output_path}")

if __name__ == "__main__":
    # 預設處理 autosprite 資料夾
    src_dir = r"d:\project\waterballsa\tutorial-platform-frontend\scripts\source_sprites"
    output_dir = r"d:\project\waterballsa\tutorial-platform-frontend\public\visual_design"
    
    if not os.path.exists(src_dir):
        print(f"找不到來源目錄: {src_dir}")
        sys.exit(1)
        
    files = [f for f in os.listdir(src_dir) if f.endswith('.png')]
    
    for f in files:
        src_path = os.path.join(src_dir, f)
        out_name = f.replace('.png', '.gif')
        out_path = os.path.join(output_dir, out_name)
        
        # 根據檔名調整 duration (例如 run 可以快一點)
        duration = 100
        if 'run' in f.lower():
            duration = 60
        elif 'walk' in f.lower():
            duration = 80
            
        convert_spritesheet_to_gif(src_path, out_path, grid_size=(5, 5), duration=duration)

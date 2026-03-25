-- 針對 PostgreSQL，如果有使用 Enum 型別或 Check Constraint 來限制 status，請執行以下語法：

-- 情境一：如果您的 status 是 VARCHAR 並依賴 Check Constraint (Hibernate 預設行為)
-- (注意：若您的 constraint 名稱不同，請自行替換 `gym_challenge_records_status_check`)
ALTER TABLE gym_challenge_records DROP CONSTRAINT IF EXISTS gym_challenge_records_status_check;
ALTER TABLE gym_challenge_records ADD CONSTRAINT gym_challenge_records_status_check CHECK (status IN ('STARTED', 'SUCCESS', 'FAILED', 'SUBMITTED', 'REVIEWING'));

-- 情境二：如果您當初建庫時使用了原生的 PostgreSQL ENUM 型別
-- (請解除下方註解並執行，若名稱不同請替換 `challenge_status`)
-- ALTER TYPE challenge_status ADD VALUE IF NOT EXISTS 'STARTED';
-- ALTER TYPE challenge_status ADD VALUE IF NOT EXISTS 'REVIEWING';

-- God Mode User Creation Script (v2)
-- Email: god@waterballsa.tw

-- 0. Fix Badge Table Schema (Create the missing relation table)
CREATE TABLE IF NOT EXISTS member_badges (
    id SERIAL PRIMARY KEY,
    member_id BIGINT NOT NULL,
    badge_id BIGINT NOT NULL,
    awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1. Insert User (ID: 999)
INSERT INTO members (id, name, email, password, nick_name, job_title, occupation, level, exp, next_level_exp, coin, created_at)
VALUES (999, '大神驗收專用', 'god@waterballsa.tw', 'password', '大神', '驗收官', 'Software Architect', 99, 999999, 1000000, 88888, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 2. Complete Initial Missions
INSERT INTO member_missions (member_id, mission_id, status, current_progress, completed_at)
SELECT 999, m.id, 'CLAIMED', 100, CURRENT_TIMESTAMP
FROM missions m
WHERE m.id IN (1, 2, 3)
ON CONFLICT DO NOTHING;

-- 3. Clone Challenge Records from User 839 to 999
-- Based on the provided data, we clone the successful attempts
INSERT INTO gym_challenge_records (
    user_id, journey_id, chapter_id, gym_id, gym_challenge_id, 
    status, feedback, ratings, submission, 
    created_at, reviewed_at, completed_at
)
SELECT 
    999, journey_id, chapter_id, gym_id, gym_challenge_id, 
    status, feedback, ratings, submission, 
    created_at, reviewed_at, completed_at
FROM gym_challenge_records 
WHERE user_id = 839
ON CONFLICT DO NOTHING;

-- 4. Award Badges to God User
-- Now using the correct table 'member_badges'
INSERT INTO member_badges (member_id, badge_id, awarded_at)
SELECT 999, id, CURRENT_TIMESTAMP FROM gym_badges
ON CONFLICT DO NOTHING;

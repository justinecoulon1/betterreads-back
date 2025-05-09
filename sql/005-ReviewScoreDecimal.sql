ALTER TABLE review
    ALTER COLUMN score TYPE NUMERIC(2, 1);

ALTER TABLE Review
    DROP CONSTRAINT review_score_check;
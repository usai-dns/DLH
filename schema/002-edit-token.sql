-- Cards get a secret edit token, generated at order creation.
-- Config writes and publish require it until real customer auth exists (M4).
ALTER TABLE cards ADD COLUMN edit_token TEXT;

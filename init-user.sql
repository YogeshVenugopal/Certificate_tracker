INSERT INTO users (username, password)
VALUES (
    COALESCE(NULLIF('$$DEFAULT_ADMIN_USER$$', ''), 'admin'),
    COALESCE(NULLIF('$$DEFAULT_ADMIN_PASSWORD$$', ''), 'admin123')
)
ON CONFLICT (username) DO NOTHING;

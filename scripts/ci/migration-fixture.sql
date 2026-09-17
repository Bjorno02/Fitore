BEGIN;

INSERT INTO "User" (id, email, name, "updatedAt") VALUES
  ('compat-coach', 'coach@compat.invalid', 'Compatibility Coach', CURRENT_TIMESTAMP),
  ('compat-athlete', 'athlete@compat.invalid', 'Compatibility Athlete', CURRENT_TIMESTAMP),
  ('compat-pending', 'pending@compat.invalid', 'Compatibility Pending', CURRENT_TIMESTAMP);

INSERT INTO "Session" (id, "sessionToken", "userId", expires, "updatedAt") VALUES
  ('compat-coach-auth', 'compat-coach-token', 'compat-coach', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
  ('compat-athlete-auth', 'compat-athlete-token', 'compat-athlete', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
  ('compat-pending-auth', 'compat-pending-token', 'compat-pending', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP);

INSERT INTO "Gym" (id, name, "updatedAt") VALUES
  ('compat-gym', 'Compatibility Gym', CURRENT_TIMESTAMP),
  ('compat-other-gym', 'Other Gym', CURRENT_TIMESTAMP);

INSERT INTO "Membership" (id, "userId", "gymId", role, status) VALUES
  ('compat-coach-member', 'compat-coach', 'compat-gym', 'COACH', 'ACTIVE'),
  ('compat-athlete-member', 'compat-athlete', 'compat-gym', 'ATHLETE', 'ACTIVE'),
  ('compat-pending-member', 'compat-pending', 'compat-gym', 'ATHLETE', 'PENDING');

INSERT INTO "TrainingSession" (id, "userId", "gymId", duration, intensity, type, "updatedAt") VALUES
  ('compat-existing-session', 'compat-athlete', 'compat-gym', 60, 5, 'drilling', CURRENT_TIMESTAMP);

INSERT INTO "CheckIn" (id, "userId", "gymId", sleep, soreness, injury, stress, "updatedAt") VALUES
  ('compat-existing-checkin', 'compat-athlete', 'compat-gym', 7, 3, false, 2, CURRENT_TIMESTAMP);

INSERT INTO "GymSettings" (id, "gymId", "multiplierDrilling", "updatedAt") VALUES
  ('compat-settings', 'compat-gym', 1.25, CURRENT_TIMESTAMP);

COMMIT;

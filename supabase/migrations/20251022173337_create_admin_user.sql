/*
  # Create Admin User

  1. Admin User Creation
    - Creates admin user account with predefined credentials
    - Email: admin@tipkovnica.hr
    - Password: admin123
    - Creates corresponding user profile
  
  2. Notes
    - This is a development/testing admin account
    - In production, use stronger credentials and proper admin role management
    - Password is hashed by Supabase auth system
*/

DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Check if admin user already exists
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'admin@tipkovnica.hr';

  -- Only create if doesn't exist
  IF admin_user_id IS NULL THEN
    -- Insert into auth.users (Supabase auth table)
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@tipkovnica.hr',
      crypt('admin123', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    ) RETURNING id INTO admin_user_id;

    -- Create user profile
    INSERT INTO user_profiles (
      id,
      email,
      display_name,
      preferred_language,
      settings
    ) VALUES (
      admin_user_id,
      'admin@tipkovnica.hr',
      'Admin',
      'hrvatski',
      '{}'::jsonb
    );

    RAISE NOTICE 'Admin user created successfully with ID: %', admin_user_id;
  ELSE
    RAISE NOTICE 'Admin user already exists with ID: %', admin_user_id;
  END IF;
END $$;
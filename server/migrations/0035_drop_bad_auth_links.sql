-- Facebook sign-ins before the fix read the Graph API's answer as a string,
-- so they were linked under the id "undefined" (shared by every Facebook
-- account). Drop such links; the next sign-in links the real id.
DELETE FROM auth_accounts WHERE provider_user_id IN ('undefined', 'null', '');

-- The default 'in_progress' violated the CHECK (status in ('started','completed')):
-- any insert relying on the default would always fail.
alter table public.module_progress alter column status set default 'started';

-- Create cost_breakdowns table
create table public.cost_breakdowns (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    project_id uuid not null references public.projects(id) on delete cascade,
    
    -- Rincian Biaya
    name text not null,
    cost numeric not null,
    description text,
    percentage numeric not null,
    
    -- Validasi
    constraint check_percentage check (percentage >= 0 and percentage <= 100),
    constraint check_cost check (cost >= 0)
); 
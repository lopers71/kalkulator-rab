-- Create price_history table
create table public.price_history (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    material_id uuid not null references public.material_costs(id) on delete cascade,
    old_price numeric not null,
    new_price numeric not null,
    change_percentage numeric not null,
    change_reason text,
    changed_by text,
    
    -- Validasi
    constraint check_prices check (old_price >= 0 and new_price >= 0),
    constraint check_percentage check (change_percentage is null or (change_percentage >= -100 and change_percentage <= 100))
);

-- Create index untuk mempercepat query
create index idx_price_history_material_id on public.price_history(material_id);
create index idx_price_history_created_at on public.price_history(created_at); 
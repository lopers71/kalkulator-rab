-- Create material_costs table
create table public.material_costs (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Informasi Material
    name text not null,
    unit text not null,
    base_price numeric not null,
    quality_multiplier jsonb not null default '{"standard": 1.0, "medium": 1.2, "premium": 1.5}',
    location_multiplier jsonb not null default '{"urban": 1.2, "suburban": 1.0, "rural": 0.8}',
    
    -- Metadata
    category text not null,
    description text,
    is_active boolean not null default true,
    
    -- Validasi
    constraint check_base_price check (base_price >= 0)
); 
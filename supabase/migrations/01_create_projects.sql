-- Create projects table
create table public.projects (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Informasi Dasar
    project_name text not null,
    location text not null,
    
    -- Dimensi
    length numeric not null,
    width numeric not null,
    height numeric not null,
    area numeric not null,
    volume numeric not null,
    
    -- Spesifikasi
    building_type text not null,
    floors integer not null default 1,
    building_quality text not null,
    location_type text not null,
    
    -- Status dan Hasil
    status text not null default 'pending',
    total_cost numeric,
    
    -- Validasi
    constraint check_building_type check (building_type in ('residential', 'commercial', 'office')),
    constraint check_building_quality check (building_quality in ('standard', 'medium', 'premium')),
    constraint check_location_type check (location_type in ('urban', 'suburban', 'rural')),
    constraint check_status check (status in ('pending', 'completed', 'cancelled')),
    constraint check_dimensions check (length > 0 and width > 0 and height > 0 and floors > 0)
); 
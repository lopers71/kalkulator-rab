-- Seed material costs data
INSERT INTO public.material_costs (name, unit, base_price, category, description) VALUES
-- Struktur
('Beton Ready Mix K-250', 'm3', 850000, 'struktur', 'Beton siap pakai untuk struktur utama'),
('Besi Beton', 'kg', 15000, 'struktur', 'Besi tulangan untuk struktur'),
('Bekisting', 'm2', 125000, 'struktur', 'Cetakan untuk pengecoran'),

-- Dinding
('Bata Merah', 'pcs', 1000, 'dinding', 'Bata merah ukuran standar'),
('Semen Portland', 'sak', 75000, 'dinding', 'Semen untuk pasangan dan plester'),
('Pasir Pasang', 'm3', 250000, 'dinding', 'Pasir untuk pasangan dinding'),

-- Finishing
('Cat Dinding', 'liter', 85000, 'finishing', 'Cat tembok premium'),
('Keramik 60x60', 'm2', 125000, 'finishing', 'Keramik lantai kualitas menengah'),
('Plafon Gypsum', 'm2', 85000, 'finishing', 'Plafon gypsum termasuk rangka'),

-- MEP
('Instalasi Listrik', 'titik', 250000, 'mep', 'Instalasi per titik lampu/stop kontak'),
('Pipa Air PVC 1/2"', 'm', 15000, 'mep', 'Pipa untuk instalasi air bersih'),
('Kloset Duduk', 'unit', 1500000, 'mep', 'Kloset duduk standar');

-- Create or replace function to update timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create trigger for projects
create trigger handle_updated_at
    before update on public.projects
    for each row
    execute function public.handle_updated_at();

-- Create trigger for material_costs
create trigger handle_updated_at
    before update on public.material_costs
    for each row
    execute function public.handle_updated_at(); 
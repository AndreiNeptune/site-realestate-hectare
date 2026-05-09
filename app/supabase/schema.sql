-- ============================================================
-- TerenVânzare - Schema SQL pentru Supabase
-- Platforma de Real Estate pentru vânzarea de terenuri
-- ============================================================

-- Activăm extensia UUID pentru generarea automată a ID-urilor
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUM TYPES
-- ============================================================

-- Tipul de teren: intravilan sau extravilan
CREATE TYPE tip_teren_enum AS ENUM ('intravilan', 'extravilan');

-- Statusul terenului pe platformă
CREATE TYPE status_teren_enum AS ENUM ('disponibil', 'rezervat', 'vandut');

-- Statusul contactului/lead-ului
CREATE TYPE status_contact_enum AS ENUM ('nou', 'contactat', 'in_discutie', 'finalizat', 'anulat');

-- ============================================================
-- TABELA: lands (Terenuri)
-- ============================================================
-- Stochează toate terenurile listate pe platformă.
-- Fiecare teren are detalii complete: locație, preț, suprafață,
-- coordonate GPS pentru hartă și un array de imagini.
-- ============================================================

CREATE TABLE lands (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Informații principale
    titlu         TEXT NOT NULL,
    descriere     TEXT,
    pret          NUMERIC(12, 2) NOT NULL CHECK (pret >= 0),
    suprafata_mp  NUMERIC(10, 2) NOT NULL CHECK (suprafata_mp > 0),

    -- Locație
    localitate    TEXT NOT NULL,
    judet         TEXT NOT NULL,
    tip_teren     tip_teren_enum NOT NULL DEFAULT 'intravilan',

    -- Coordonate GPS (latitudine, longitudine) pentru integrare cu hărți
    latitudine    DOUBLE PRECISION,
    longitudine   DOUBLE PRECISION,

    -- Imagini - array de URL-uri către imagini stocate în Supabase Storage
    imagini       TEXT[] DEFAULT '{}',

    -- Status curent al terenului
    status        status_teren_enum NOT NULL DEFAULT 'disponibil'
);

-- Index pe județ și localitate pentru filtrare rapidă
CREATE INDEX idx_lands_judet ON lands (judet);
CREATE INDEX idx_lands_localitate ON lands (localitate);
CREATE INDEX idx_lands_status ON lands (status);
CREATE INDEX idx_lands_tip_teren ON lands (tip_teren);
CREATE INDEX idx_lands_pret ON lands (pret);
CREATE INDEX idx_lands_suprafata ON lands (suprafata_mp);
CREATE INDEX idx_lands_created_at ON lands (created_at DESC);

-- Trigger pentru actualizarea automată a câmpului updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_lands_updated_at
    BEFORE UPDATE ON lands
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TABELA: leads (Contacte / Cereri de informații)
-- ============================================================
-- Stochează cererile de contact primite de la potențiali cumpărători.
-- Fiecare lead este legat de un teren specific prin foreign key.
-- ============================================================

CREATE TABLE leads (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Referință către terenul pentru care s-a trimis cererea
    land_id         UUID NOT NULL REFERENCES lands(id) ON DELETE CASCADE,

    -- Datele clientului
    nume_client     TEXT NOT NULL,
    telefon         TEXT NOT NULL,
    email           TEXT,
    mesaj           TEXT,

    -- Statusul procesării contactului
    status_contact  status_contact_enum NOT NULL DEFAULT 'nou'
);

-- Index pe land_id pentru a vedea rapid toate cererile unui teren
CREATE INDEX idx_leads_land_id ON leads (land_id);
CREATE INDEX idx_leads_status_contact ON leads (status_contact);
CREATE INDEX idx_leads_created_at ON leads (created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
-- Activăm RLS pe ambele tabele pentru securitate.
-- Politicile permit citire publică (anon) pentru terenuri disponibile
-- și scriere publică doar pentru lead-uri (formulare de contact).
-- Operațiile de administrare necesită autentificare.
-- ============================================================

ALTER TABLE lands ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- LANDS: Citire publică pentru terenurile disponibile
CREATE POLICY "Terenurile sunt vizibile public"
    ON lands
    FOR SELECT
    USING (true);

-- LANDS: Doar utilizatorii autentificați pot insera/actualiza/șterge
CREATE POLICY "Doar adminii pot insera terenuri"
    ON lands
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Doar adminii pot actualiza terenuri"
    ON lands
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Doar adminii pot sterge terenuri"
    ON lands
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- LEADS: Oricine poate trimite o cerere de contact (inserare publică)
CREATE POLICY "Oricine poate trimite un lead"
    ON leads
    FOR INSERT
    WITH CHECK (true);

-- LEADS: Doar utilizatorii autentificați pot vedea/actualiza lead-urile
CREATE POLICY "Doar adminii pot vedea lead-uri"
    ON leads
    FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Doar adminii pot actualiza lead-uri"
    ON leads
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET pentru imagini (rulat separat în Supabase Dashboard)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('land-images', 'land-images', true);
-- ============================================================

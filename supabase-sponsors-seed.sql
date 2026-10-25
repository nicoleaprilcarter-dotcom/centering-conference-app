-- ------------------------------------------------------------
-- SPONSOR SEED DATA
-- Run this in the Supabase SQL Editor (same place you ran
-- supabase-schema.sql) after this app deploy has gone live, so the
-- logo files below actually exist at your site's /images/sponsors/
-- path. Safe to run more than once — each insert is skipped if a
-- sponsor with that name already exists.
--
-- To adjust later: Table Editor -> sponsors. Editing note_en/note_es
-- changes the tier label shown under the logo; editing website_url
-- changes where "Visit website" points; sort controls display order
-- (lower numbers show first).
-- ------------------------------------------------------------

insert into sponsors (name, note_en, note_es, logo_url, website_url, sort)
select 'Ohio Commission on Minority Health', 'Platinum Sponsor', 'Patrocinador Platino', '/images/sponsors/ohio-commission-minority-health.png', 'https://mih.ohio.gov', 10
where not exists (select 1 from sponsors where name = 'Ohio Commission on Minority Health');

insert into sponsors (name, note_en, note_es, logo_url, website_url, sort)
select 'Pfizer', 'Platinum Sponsor', 'Patrocinador Platino', '/images/sponsors/pfizer.png', 'https://www.pfizer.com', 20
where not exists (select 1 from sponsors where name = 'Pfizer');

insert into sponsors (name, note_en, note_es, logo_url, website_url, sort)
select 'Kettering Health', 'Gold Sponsor', 'Patrocinador Oro', '/images/sponsors/kettering-health.png', 'https://www.ketteringhealth.org', 30
where not exists (select 1 from sponsors where name = 'Kettering Health');

insert into sponsors (name, note_en, note_es, logo_url, website_url, sort)
select 'CompassionRx Naturals', 'Silver Sponsor', 'Patrocinador Plata', '/images/sponsors/compassionrx-naturals.png', null, 40
where not exists (select 1 from sponsors where name = 'CompassionRx Naturals');

insert into sponsors (name, note_en, note_es, logo_url, website_url, sort)
select 'Karla Knox, Certified Financial Educator', 'Community Sponsor', 'Patrocinador Comunitario', '/images/sponsors/karla-knox.png', null, 50
where not exists (select 1 from sponsors where name = 'Karla Knox, Certified Financial Educator');

insert into sponsors (name, note_en, note_es, logo_url, website_url, sort)
select 'Dayton Dragons', 'Community Sponsor', 'Patrocinador Comunitario', '/images/sponsors/dayton-dragons.png', 'https://www.milb.com/dayton', 60
where not exists (select 1 from sponsors where name = 'Dayton Dragons');

insert into sponsors (name, note_en, note_es, logo_url, website_url, sort)
select 'CareSource — Black Employee Network', 'Community Sponsor', 'Patrocinador Comunitario', '/images/sponsors/caresource-ben.png', 'https://www.caresource.com', 70
where not exists (select 1 from sponsors where name = 'CareSource — Black Employee Network');

insert into sponsors (name, note_en, note_es, logo_url, website_url, sort)
select 'Sean Lightfoot, Howard Hanna Real Estate Services', 'Community Sponsor', 'Patrocinador Comunitario', '/images/sponsors/sean-lightfoot-howard-hanna.png', 'https://www.howardhanna.com/Agent/Detail/Sean-Lightfoot/71041', 80
where not exists (select 1 from sponsors where name = 'Sean Lightfoot, Howard Hanna Real Estate Services');

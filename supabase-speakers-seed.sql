-- ------------------------------------------------------------
-- SPEAKERS SEED
-- Run this in the Supabase SQL Editor to add bios to the People ->
-- Speakers tab. Safe to run more than once — skips anyone already
-- listed by name. To edit a bio later, use the Table Editor ->
-- speakers table directly (editing here and re-running won't
-- update an existing row, only add a missing one).
--
-- session_id just links a speaker card to the session they're
-- known for; it isn't required for them to show up on this tab.
-- ------------------------------------------------------------

insert into speakers (name, role_en, role_es, bio_en, bio_es, session_id, sort)
select
  'Deborah "Nurse Deb" Ault',
  'RN, Health Care Strategist & Author',
  'RN, Estratega de Salud y Autora',
  'Deborah "Nurse Deb" Ault, RN, is a health care strategist, author, and speaker with more than 30 years of experience spanning medical management, evidence-based care oversight, patient advocacy, and employer-sponsored health plan design. Her work focuses on aligning clinical accountability, patient safety, equity, and sustainable health care economics. Known for her bold, patient-centered approach to health care reform, she has contributed to multiple books on health care leadership, patient advocacy, and system transformation, and was featured in the health care documentary It''s Not Personal, It''s Just Healthcare. Through her writing, speaking, and consulting, she challenges traditional health care models while advocating for transparency, accountability, and outcomes-driven care that serves both patients and employers.',
  'Deborah "Nurse Deb" Ault, enfermera registrada (RN), es estratega de salud, autora y oradora con más de 30 años de experiencia en gestión médica, supervisión de atención basada en evidencia, defensa de los pacientes y diseño de planes de salud patrocinados por empleadores. Su trabajo se enfoca en alinear la responsabilidad clínica, la seguridad del paciente, la equidad y la sostenibilidad económica de la atención médica. Conocida por su enfoque audaz y centrado en el paciente para la reforma del sistema de salud, ha contribuido a varios libros sobre liderazgo en salud, defensa del paciente y transformación del sistema, y apareció en el documental de salud It''s Not Personal, It''s Just Healthcare. A través de su escritura, oratoria y consultoría, desafía los modelos tradicionales de atención médica mientras defiende la transparencia, la responsabilidad y una atención centrada en resultados que beneficie tanto a los pacientes como a los empleadores.',
  's8',
  10
where not exists (select 1 from speakers where name = 'Deborah "Nurse Deb" Ault');

insert into speakers (name, role_en, role_es, bio_en, bio_es, session_id, sort)
select
  'Sonya Wells',
  'MSN, APRN, FNP-C, CEO, Sonya Wells Public Health & Wellness Consulting',
  'MSN, APRN, FNP-C, Directora Ejecutiva, Sonya Wells Public Health & Wellness Consulting',
  'Sonya Wells, MSN, APRN, FNP-C, is a Board-Certified Family Nurse Practitioner, public health leader, and CEO of Sonya Wells Public Health & Wellness Consulting. With more than two decades of experience across health care and fitness, she holds degrees from Indiana Wesleyan University and Walden University. She serves as Vice Chair of Black Women Cultivating Change (BWCC) and as a provider at Liberty Family Medicine in Liberty Township, Ohio.',
  'Sonya Wells, MSN, APRN, FNP-C, es enfermera practicante familiar certificada, líder en salud pública y directora ejecutiva de Sonya Wells Public Health & Wellness Consulting. Con más de dos décadas de experiencia en salud y acondicionamiento físico, tiene títulos de Indiana Wesleyan University y Walden University. Es vicepresidenta de Black Women Cultivating Change (BWCC) y proveedora en Liberty Family Medicine, en Liberty Township, Ohio.',
  's10c',
  20
where not exists (select 1 from speakers where name = 'Sonya Wells');

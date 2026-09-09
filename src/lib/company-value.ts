import { db } from './db';

export interface CompanySettingData {
  id: string;
  companyNetValue: number;
  currency: string;
  notes: string | null;
  updatedAt: string;
  updatedBy: string | null;
}

let tableEnsured = false;

export async function ensureCompanySettingsTable(): Promise<void> {
  if (tableEnsured) return;
  try {
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "company_settings" (
        "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
        "companyNetValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "currency" TEXT NOT NULL DEFAULT 'EGP',
        "notes" TEXT,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedBy" TEXT
      );
    `);
    tableEnsured = true;
  } catch (error) {
    console.error('Error ensuring company_settings table:', error);
  }
}

export async function getCompanySetting(): Promise<CompanySettingData> {
  await ensureCompanySettingsTable();

  try {
    let setting = await db.companySetting.findUnique({
      where: { id: 'default' },
    });

    if (!setting) {
      setting = await db.companySetting.create({
        data: {
          id: 'default',
          companyNetValue: 0,
          currency: 'EGP',
          notes: 'Initial bank balance',
        },
      });
    }

    return {
      id: setting.id,
      companyNetValue: setting.companyNetValue,
      currency: setting.currency,
      notes: setting.notes,
      updatedAt: setting.updatedAt.toISOString(),
      updatedBy: setting.updatedBy,
    };
  } catch (error) {
    console.error('Failed to get company setting:', error);
    return {
      id: 'default',
      companyNetValue: 0,
      currency: 'EGP',
      notes: null,
      updatedAt: new Date().toISOString(),
      updatedBy: null,
    };
  }
}

export async function updateCompanySetting(
  companyNetValue: number,
  userEmail?: string,
  notes?: string | null
): Promise<CompanySettingData> {
  await ensureCompanySettingsTable();

  const setting = await db.companySetting.upsert({
    where: { id: 'default' },
    create: {
      id: 'default',
      companyNetValue,
      currency: 'EGP',
      notes: notes ?? null,
      updatedBy: userEmail ?? null,
    },
    update: {
      companyNetValue,
      notes: notes !== undefined ? notes : undefined,
      updatedBy: userEmail ?? undefined,
    },
  });

  return {
    id: setting.id,
    companyNetValue: setting.companyNetValue,
    currency: setting.currency,
    notes: setting.notes,
    updatedAt: setting.updatedAt.toISOString(),
    updatedBy: setting.updatedBy,
  };
}

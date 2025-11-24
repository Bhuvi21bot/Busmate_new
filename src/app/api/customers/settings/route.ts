import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { customerSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get authenticated session using better-auth
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    // Query settings by userId
    const settings = await db.select()
      .from(customerSettings)
      .where(eq(customerSettings.userId, session.user.id))
      .limit(1);

    // If settings not found, auto-create with default values
    if (settings.length === 0) {
      const defaultSettings = {
        userId: session.user.id,
        notificationsEnabled: true,
        emailNotifications: true,
        smsNotifications: true,
        rideReminders: true,
        promotionalEmails: false,
        language: 'en',
        theme: 'light',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const newSettings = await db.insert(customerSettings)
        .values(defaultSettings)
        .returning();

      return NextResponse.json(newSettings[0], { status: 200 });
    }

    return NextResponse.json(settings[0], { status: 200 });
  } catch (error) {
    console.error('GET /api/customers/settings error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get authenticated session using better-auth
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const {
      notificationsEnabled,
      emailNotifications,
      smsNotifications,
      rideReminders,
      promotionalEmails,
      language,
      theme
    } = body;

    // Validate at least one field is provided
    const hasUpdates = notificationsEnabled !== undefined ||
                      emailNotifications !== undefined ||
                      smsNotifications !== undefined ||
                      rideReminders !== undefined ||
                      promotionalEmails !== undefined ||
                      language !== undefined ||
                      theme !== undefined;

    if (!hasUpdates) {
      return NextResponse.json({ 
        error: 'At least one field is required for update',
        code: 'NO_FIELDS_PROVIDED'
      }, { status: 400 });
    }

    // Build update object with validation
    const updates: any = {};

    // Validate boolean fields
    if (notificationsEnabled !== undefined) {
      if (typeof notificationsEnabled !== 'boolean') {
        return NextResponse.json({ 
          error: 'notificationsEnabled must be a boolean',
          code: 'INVALID_BOOLEAN'
        }, { status: 400 });
      }
      updates.notificationsEnabled = notificationsEnabled;
    }

    if (emailNotifications !== undefined) {
      if (typeof emailNotifications !== 'boolean') {
        return NextResponse.json({ 
          error: 'emailNotifications must be a boolean',
          code: 'INVALID_BOOLEAN'
        }, { status: 400 });
      }
      updates.emailNotifications = emailNotifications;
    }

    if (smsNotifications !== undefined) {
      if (typeof smsNotifications !== 'boolean') {
        return NextResponse.json({ 
          error: 'smsNotifications must be a boolean',
          code: 'INVALID_BOOLEAN'
        }, { status: 400 });
      }
      updates.smsNotifications = smsNotifications;
    }

    if (rideReminders !== undefined) {
      if (typeof rideReminders !== 'boolean') {
        return NextResponse.json({ 
          error: 'rideReminders must be a boolean',
          code: 'INVALID_BOOLEAN'
        }, { status: 400 });
      }
      updates.rideReminders = rideReminders;
    }

    if (promotionalEmails !== undefined) {
      if (typeof promotionalEmails !== 'boolean') {
        return NextResponse.json({ 
          error: 'promotionalEmails must be a boolean',
          code: 'INVALID_BOOLEAN'
        }, { status: 400 });
      }
      updates.promotionalEmails = promotionalEmails;
    }

    // Validate language
    if (language !== undefined) {
      if (typeof language !== 'string' || language.trim() === '') {
        return NextResponse.json({ 
          error: 'language must be a non-empty string',
          code: 'INVALID_LANGUAGE'
        }, { status: 400 });
      }
      updates.language = language.trim();
    }

    // Validate theme
    if (theme !== undefined) {
      if (theme !== 'light' && theme !== 'dark') {
        return NextResponse.json({ 
          error: 'theme must be either "light" or "dark"',
          code: 'INVALID_THEME'
        }, { status: 400 });
      }
      updates.theme = theme;
    }

    // Check if settings exist for this user
    const existingSettings = await db.select()
      .from(customerSettings)
      .where(eq(customerSettings.userId, session.user.id))
      .limit(1);

    if (existingSettings.length === 0) {
      return NextResponse.json({ 
        error: 'Settings not found for this user',
        code: 'SETTINGS_NOT_FOUND'
      }, { status: 404 });
    }

    // Always update updatedAt timestamp
    updates.updatedAt = new Date().toISOString();

    // Update settings
    const updatedSettings = await db.update(customerSettings)
      .set(updates)
      .where(eq(customerSettings.userId, session.user.id))
      .returning();

    return NextResponse.json(updatedSettings[0], { status: 200 });
  } catch (error) {
    console.error('PUT /api/customers/settings error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}
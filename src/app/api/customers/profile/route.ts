import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { customerProfiles } from '@/db/schema';
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

    // Query profile by userId from session
    const profile = await db.select()
      .from(customerProfiles)
      .where(eq(customerProfiles.userId, session.user.id))
      .limit(1);

    if (profile.length === 0) {
      return NextResponse.json({ 
        error: 'Customer profile not found',
        code: 'PROFILE_NOT_FOUND' 
      }, { status: 404 });
    }

    return NextResponse.json(profile[0], { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
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
      phone, 
      address, 
      city, 
      state, 
      pincode, 
      emergencyContact, 
      emergencyContactName 
    } = body;

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    // Build update object with only provided fields
    const updates: Record<string, string> = {};
    
    if (phone !== undefined) {
      const trimmedPhone = phone.trim();
      // Optional phone validation
      if (trimmedPhone && !/^\+?[\d\s\-()]+$/.test(trimmedPhone)) {
        return NextResponse.json({ 
          error: 'Invalid phone number format',
          code: 'INVALID_PHONE' 
        }, { status: 400 });
      }
      updates.phone = trimmedPhone;
    }
    
    if (address !== undefined) updates.address = address.trim();
    if (city !== undefined) updates.city = city.trim();
    if (state !== undefined) updates.state = state.trim();
    if (pincode !== undefined) updates.pincode = pincode.trim();
    if (emergencyContact !== undefined) updates.emergencyContact = emergencyContact.trim();
    if (emergencyContactName !== undefined) updates.emergencyContactName = emergencyContactName.trim();

    // Validate at least one field is provided
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ 
        error: 'At least one field must be provided for update',
        code: 'NO_FIELDS_TO_UPDATE' 
      }, { status: 400 });
    }

    // Always update updatedAt timestamp
    updates.updatedAt = new Date().toISOString();

    // Check if profile exists for this user
    const existingProfile = await db.select()
      .from(customerProfiles)
      .where(eq(customerProfiles.userId, session.user.id))
      .limit(1);

    if (existingProfile.length === 0) {
      return NextResponse.json({ 
        error: 'Customer profile not found',
        code: 'PROFILE_NOT_FOUND' 
      }, { status: 404 });
    }

    // Update profile
    const updated = await db.update(customerProfiles)
      .set(updates)
      .where(eq(customerProfiles.userId, session.user.id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to update profile',
        code: 'UPDATE_FAILED' 
      }, { status: 500 });
    }

    return NextResponse.json(updated[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}
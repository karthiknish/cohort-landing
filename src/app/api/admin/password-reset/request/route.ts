'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore, getAdminAuth } from '@/lib/firebase-admin';
import { sendPasswordResetEmail } from '@/lib/brevo';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const db = getAdminFirestore();
    const auth = getAdminAuth();

    // Check if user exists in Firebase Auth
    try {
      await auth.getUserByEmail(email);
    } catch {
      // User doesn't exist, but we return success anyway for security
      // (don't reveal whether email exists)
      console.log('Password reset requested for non-existent email:', email);
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    }

    // Generate secure token
    const token = randomUUID();
    const now = Date.now();
    const expiresAt = now + 60 * 60 * 1000; // 1 hour from now

    // Store token in Firestore
    await db.collection('password_reset_tokens').doc(token).set({
      email,
      token,
      createdAt: now,
      expiresAt,
      used: false,
    });

    // Build reset link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cohorts.team';
    const resetLink = `${baseUrl}/admin/reset-password?token=${token}`;

    // Send email via Brevo
    const emailResult = await sendPasswordResetEmail(email, resetLink);

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send password reset email. Please try again.' },
        { status: 500 }
      );
    }

    console.log('Password reset email sent successfully to:', email);

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

interface LeadData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

interface LeadStatusUpdate {
  id: string;
  status: 'new' | 'contacted' | 'converted';
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadData = await request.json();

    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const db = getAdminFirestore();
    
    // Add lead to Firestore
    const leadData = {
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      company: body.company || '',
      status: 'new',
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('leads').add(leadData);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Lead submitted successfully',
        id: docRef.id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting lead:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = getAdminFirestore();
    
    const snapshot = await db
      .collection('leads')
      .orderBy('createdAt', 'desc')
      .get();

    const leads = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
    }));

    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body: LeadStatusUpdate = await request.json();

    if (!body.id || !body.status) {
      return NextResponse.json(
        { error: 'Lead id and status are required' },
        { status: 400 }
      );
    }

    const allowedStatuses: Array<LeadStatusUpdate['status']> = [
      'new',
      'contacted',
      'converted',
    ];

    if (!allowedStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const db = getAdminFirestore();
    const docRef = db.collection('leads').doc(body.id);

    const existing = await docRef.get();
    if (!existing.exists) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    await docRef.update({
      status: body.status,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

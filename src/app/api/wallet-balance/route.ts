import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { walletTransactionsNew } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const transactions = await db
      .select()
      .from(walletTransactionsNew)
      .where(eq(walletTransactionsNew.userId, userId))
      .orderBy(desc(walletTransactionsNew.createdAt));

    if (transactions.length === 0) {
      return NextResponse.json({
        balance: 0,
        totalTransactions: 0,
        lastTransaction: null,
      });
    }

    const latestTransaction = transactions[0];
    const currentBalance = latestTransaction.balanceAfter;

    return NextResponse.json({
      balance: currentBalance,
      totalTransactions: transactions.length,
      lastTransaction: {
        id: latestTransaction.id,
        type: latestTransaction.type,
        amount: latestTransaction.amount,
        description: latestTransaction.description,
        referenceId: latestTransaction.referenceId,
        createdAt: latestTransaction.createdAt,
      },
    });
  } catch (error) {
    console.error('GET wallet balance error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
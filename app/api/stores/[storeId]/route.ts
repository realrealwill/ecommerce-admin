import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function PATCH (
  req: Request,
  { params }: { params: { storeId: string } & Promise<any> }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name } = body;
    if (!userId) {
      return new Response('Unauthenticated', { status: 401 });
    }

    if (!name) {
      return new Response('Name is required', { status: 400 });
    }

    if (!params.storeId) {
      return new Response('Store ID is required', { status: 400 });
    }

    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name
      }
    });

    return NextResponse.json(store);

  } catch (error) {
    console.log('[STORE_PATCH]', error);
    return new Response('Internal Error', { status: 500 });
  }
};

export async function DELETE (
  req: Request,
  { params }: { params: { storeId: string } & Promise<any> }
) {
  try {
    const { userId } = await auth();;
    if (!userId) {
      return new Response('Unauthenticated', { status: 401 });
    }

    if (!params.storeId) {
      return new Response('Store ID is required', { status: 400 });
    }

    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    });

    return NextResponse.json(store);

  } catch (error) {
    console.log('[STORE_DELETE]', error);
    return new Response('Internal Error', { status: 500 });
  }
};
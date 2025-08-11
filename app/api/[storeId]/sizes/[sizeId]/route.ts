import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function GET (
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return new Response('Size ID is required', { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      }
    });

    return NextResponse.json(size);

  } catch (error) {
    console.log('[SIZE_GET]', error);
    return new Response('Internal Error', { status: 500 });
  }
};

export async function PATCH (
  req: Request,
  { params }: { params: { storeId: string, sizeId: string } }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, value } = body;
    if (!userId) {
      return new Response('Unauthenticated', { status: 401 });
    }

    if (!name) {
      return new Response('Name is required', { status: 400 });
    }

    if (!value) {
      return new Response('Value required', { status: 400 });
    }


    if (!params.sizeId) {
      return new Response('Size ID is required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const size = await prismadb.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value
      }
    });

    return NextResponse.json(size);

  } catch (error) {
    console.log('[SIZE_PATCH]', error);
    return new Response('Internal Error', { status: 500 });
  }
};


export async function DELETE (
  req: Request,
  { params }: { params: { storeId: string, sizeId: string } }
) {
  try {
    const { userId } = await auth();;
    if (!userId) {
      return new Response('Unauthenticated', { status: 401 });
    }

    if (!params.sizeId) {
      return new Response('Size ID is required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const size = await prismadb.size.deleteMany({
      where: {
        id: params.sizeId,
      }
    });

    return NextResponse.json(size);

  } catch (error) {
    console.log('[SIZE_DELETE]', error);
    return new Response('Internal Error', { status: 500 });
  }
};
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import prismadb from '@/lib/prismadb';

export async function POST (
  req: Request,
  { params } : {params: { storeId: string } & Promise<any>},
) {
  try {
    const {userId} = await auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 }); 
    }

    const { label, imageUrl } = body;
    if (!label) {
      return new NextResponse('Label is required', { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse('Image URL is required', { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
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

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId
      }
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[BILLBOARDS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET (  // get all billboards available in a store
  req: Request,
  { params } : {params: { storeId: string } & Promise<any>},
) {
  try {

    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId
      }
    });
    return NextResponse.json(billboards);
  } catch (error) {
    console.log('[BILLBOARDS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
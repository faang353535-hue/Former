'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CardsGrid from '@/components/gridshowcase'
import { Skeleton } from '@/components/ui/skeleton';
import { authApi } from '@/lib/api';
import CopyToClipboard from '@/components/ui/copy';

interface Card {
  id: string;
  form_data: {
    name: string;
    fields: [
      {
        id: number;
        title: string;
        type: string;
        rating?: number;
      }
    ];
    fontColor?: string;
    backgroundColor: string;
  };
}

const CardsPage = () => {

  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  const getForm = async () => {
    try {
      setLoading(true);
      const response = await authApi.getForms()
      setCards(response.data)
      console.log(response);
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getForm()
      .finally(() => setLoading(false));
  }, []);


  return (
    <div className="container mx-auto px-4 py-8 pt-20 h-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Cards</h1>
        <div className="space-x-4">
          {/* <button className="m-3 px-2.5 py-1 bg-ring rounded-sm"> */}
          <Link href="./actions/Add"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add
          </Link>
          {/* </button> */}
          <Link
            href="/actions/Edit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Edit Cards
          </Link>
          <Link
            href="/actions/Delete"
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Delete Cards
          </Link>
        </div>
      </div>

      {loading ? (
        <div className='lg:columns-2 columns-1 overflow-hidden px-5 pb-5'>
          {[...Array(4)].map((_, index) => (
            <div key={index} className="relative pb-4">
              <Skeleton className="w-full h-[300px] rounded-xl border-2" />
              <div className='absolute bottom-2 w-full p-4 flex justify-between items-center'>
                <Skeleton className="h-8 w-32 rounded-xl" />
                <Skeleton className="w-12 h-12 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
          <CardsGrid formData={cards} />
      )}
    </div>
  );
};

export default CardsPage;
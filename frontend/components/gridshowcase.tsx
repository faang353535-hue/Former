'use client';
import { motion } from 'motion/react';
import { MoveUpRight } from 'lucide-react';
import { Preview } from '@/app/actions/Add/Preview';
import { useEffect } from 'react';
import CopyToClipboard from './ui/copy';
import { useRouter } from 'next/navigation';

interface Field {
  id: number;
  title: string;
  type: string;
  rating?: number;
}

interface Card {
  id: string;
  form_data: {
    name: string;
    fields: Field[];
    fontColor?: string;
    backgroundColor: string;
  };
}



export default function CardsGrid({ formData: cards }: { formData: Card[] }) {
  const router = useRouter();
  useEffect(() => {
  }, [])
  return (
    <>
      <div className='lg:columns-2 columns-1 overflow-hidden  px-5 pb-5 '>
        {cards.map((card, index) => {
          return (
            <motion.article
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 10 }}
              transition={{ ease: 'easeOut' }}
              viewport={{ once: false }}
              className={` relative rounded-2xl shadow-[inset_0px_30px_40px_0px_rgba(0,0,0,0.1),inset_0px_0px_20px_0px_rgba(0,0,0,0.1),0px_-5px_10px_0px_rgba(63,63,63,0.2)] `}
            >
              <div className='absolute top-3 right-3'>
                <CopyToClipboard formId={card.id} />
              </div>
              <div className='w-full h-[300px] overflow-y-auto rounded-[0.6rem] border-2 hide-scroll'>
                <Preview
                  formName={card.form_data.name}
                  backgroundColor={card.form_data.backgroundColor}
                  fontColor={card.form_data.fontColor}
                  fields={card.form_data.fields}
                />
              </div>
              <div className='absolute bottom-2 text-black w-full p-4 flex justify-between items-center'>
                <h3 className='sm:text-xl text-sm bg-black/80 dark:bg-black text-white dark:text-white rounded-xl p-2 px-4'>
                  {card.form_data.name}
                </h3>
                <div
                  className='w-12 h-12 text-white dark:text-white grid place-content-center rounded-full bg-black/80 dark:bg-black cursor-pointer'
                  onClick={() => router.push(`/responses?formId=${card.id}`)}
                >
                  <MoveUpRight />
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </>
  );
}

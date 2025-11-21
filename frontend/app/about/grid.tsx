"use client"
import { MonitorSmartphone, Layout, Accessibility, Eye, CheckCircle, Activity, Layers, Palette } from "lucide-react";
import React from 'react';
import { useState } from 'react';
// import preview from '@/assets/preview/Preview';
import Image from 'next/image';
interface CardItem {
    icon: React.ElementType;
    text: string;
}

const cardData: CardItem[] = [
    {
        icon: MonitorSmartphone,
        text: "Responsive design with Tailwind/Bootstrap"
    },
    {
        icon: Eye,
        text: "Accessibility-first components"
    },
    {
        icon: CheckCircle,
        text: "Real-time validation and preview"
    },
    {
        icon: Layers,
        text: "Custom themes and transitions"
    }
];

const GridCard: React.FC<CardItem> = ({ icon: Icon, text }) => {
    return (
        <div className='flex flex-col p-6  justify-evenly dark:bg-neutral-800 font-medium text-[18px] bg-gray-100 w-full h-full lg:rounded-xl rounded-md shadow-[inset_0px_2px_0px_0px_rgba(161,160,160,0.5),0px_2px_4px_0px_rgba(0,0,0,0.2)] dark:shadow-[inset_0px_2px_0px_0px_rgba(61,57,57,0.5),0px_2px_4px_0px_rgba(0,0,0,0.2)]'>
            <Icon size={24} className="bg-neutral-300 dark:bg-neutral-600  h-fit w-fit p-2 rounded-md  "/>
            {text}
        </div>
    );
};

export default function Grid() {
    return (
        <>
            <div className='flex gap-2 h-80 py-20 px-5 bg-background border-t border-neutral-300 dark:border-t-neutral-600'>
                {cardData.map((card, index) => (
                    <GridCard key={index} icon={card.icon} text={card.text}  />
                ))}
            </div>
        </>
    );
}

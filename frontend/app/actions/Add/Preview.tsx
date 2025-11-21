'use client';
import React from 'react';
import { StarRating } from './starrating';

interface ItemType {
    id: number;
    title: string;
    type: string;
    rating?: number;
}

interface PreviewProps {
    formName: string;
    backgroundColor: string;
    fontColor?: string;
    fields: ItemType[];
}

const renderField = (item: ItemType, fontColor: string) => {
    switch (item.type) {
        case 'text':
            return <div>
                <label className="block text-sm font-medium text-gray-700" style={{ color: `${fontColor}` }}>{item.title}</label>
                <input type="text" className='bg-accent text-accent-foreground rounded-sm p-2 h-8 w-full' /></div>;
        case 'number':
            return <div> <label className="block text-sm font-medium text-gray-700" style={{ color: `${fontColor}` }}>{item.title}</label>
                <input type="number" className='bg-accent text-accent-foreground rounded-sm p-2 h-8 w-full' /></div>;
        case 'checkbox':
            return <div className="flex items-center"><input type="checkbox" id={item.id.toString()} className='bg-accent text-accent-foreground rounded-sm p-2 h-8' /><label htmlFor={item.id.toString()} className="ml-2" style={{ color: `${fontColor}` }}>{item.title || 'Checkbox'}</label></div>;
        case 'rating':
            return <div className="flex items-center"><label className="mr-2">{item.title || 'Rating'}</label><StarRating rating={0} onRatingChange={() => { }} /></div>;
        case 'text Area':
            return <div><label className="block text-sm font-medium text-gray-700" style={{ color: `${fontColor}` }}>{item.title}</label>
                <textarea className='bg-accent text-accent-foreground rounded-sm p-2 h-auto w-full' ></textarea></div>;
        default:
            return <div> <label className="block text-sm font-medium text-gray-700" style={{ color: `${fontColor}` }}>{item.title}</label>
                <input type="text" placeholder={item.title || 'Text Input'} className='bg-accent text-accent-foreground rounded-sm p-2 h-8 w-full' /></div>;
    }
};

export const Preview = ({ formName, backgroundColor, fontColor = 'black', fields }: PreviewProps) => {
    return (
        <div className="p-4 border-2 rounded-lg w-full" style={{ backgroundColor: backgroundColor || 'white', color: fontColor }}>
            <h2 className="text-2xl font-bold mb-4">{formName || 'Form Preview'}</h2>
            <form
                className="space-y-4"
                onSubmit={(e) => {
                    e.preventDefault();
                }}
            >
                {fields.map(field => (
                    <div key={field.id}>
                        {renderField(field, fontColor)}
                    </div>
                ))}
                {fields.length > 0 && <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">Submit</button>}
            </form>
        </div>
    );
};

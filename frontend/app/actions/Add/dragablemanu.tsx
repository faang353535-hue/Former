'use client';
import React, { useEffect, useState } from 'react';
import {
    useMotionValue,
    Reorder,
    useDragControls,
    motion,
    MotionValue,
    animate,
    DragControls,
} from 'motion/react';
import { Button } from "@/components/ui/button";
import { Selector } from './selector';
import { StarRating } from './starrating';

export interface ItemType {
    id: number;
    title: string;
    type: string;
    rating?: number;
}

interface MoveIndexProps {
    items: ItemType[];
    setItems: (items: ItemType[]) => void;
    addField: (type: string) => void;
    removeField: (id: number) => void;
    updateItem: (id: number, updatedProperties: Partial<ItemType>) => void;
}

export default function MoveIndex({ items, setItems, addField, removeField, updateItem }: MoveIndexProps) {
    const [selectedField, setSelectedField] = React.useState("");

    const handleAddField = () => {
        if (selectedField) {
            addField(selectedField);
        }
    };

    const renderField = (item: ItemType) => {
        switch (item.type) {
            case 'text':
                return <input type="text" name="" id="" className='bg-accent text-accent-foreground rounded-sm p-2 h-8 ' />;
            case 'number':
                return <input type="number" name="" id="" className='bg-accent text-accent-foreground rounded-sm p-2 h-8 ' />;
            case 'checkbox':
                return <input type="checkbox" name="" id="" className='bg-accent text-accent-foreground rounded-sm p-2 h-8 ' />;
            case 'rating':
                return <StarRating rating={item.rating || 0} onRatingChange={(newRating) => updateItem(item.id, { rating: newRating })} />;
            case 'text Area':
                return <textarea name="" id="" className='bg-accent text-accent-foreground rounded-sm p-2 h-8 ' ></textarea>;
            default:
                return <input type="text" name="" id="" className='bg-accent text-accent-foreground rounded-sm p-2 h-8 ' />;
        }
    };

    return (
        <>
            <div className='my-3 flex flex-row gap-4 items-center'>
                <Selector selectedField={selectedField} onSelectField={setSelectedField}></Selector>
                <Button className=' h-8 w-10 rounded-sm' variant={"secondary"}  onClick={handleAddField} disabled={items.length >= 8}>add</Button>
            
            </div>
            <Reorder.Group
                axis='y'
                values={items}
                onReorder={setItems}
                className='space-y-2  w-135'
            >
                {items.map((item) => (
                    <Item key={item.id} item={item} removeField={removeField} updateItem={updateItem}>
                        {renderField(item)}
                    </Item>
                ))}
            </Reorder.Group>
        </>
    );
}

const Item = ({ children, item, removeField, updateItem }: { children: React.ReactNode; item: ItemType; removeField: (id: number) => void; updateItem: (id: number, updatedProperties: Partial<ItemType>) => void; }) => {
    const y = useMotionValue(0);
    const boxShadow = useRaisedShadow(y);
    const dragControls = useDragControls();
    const [isDragging, setIsDragging] = useState(false);
    const [pressed, setPressed] = useState(false);

    return (
        <Reorder.Item
            value={item}
            style={{ boxShadow, y }}
            dragListener={false}
            dragControls={dragControls}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => {
                setIsDragging(false);
                setPressed(false);
            }}
            onPointerUp={() => setPressed(false)}
            onPointerCancel={() => setPressed(false)}
            className='flex justify-between items-center w-full p-3 text-primary-foreground bg-primary border rounded-md'
        >
            <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(item.id, { title: e.target.value })}
                placeholder="Field Name"
                className="bg-transparent border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 mr-4 text-white"
            />
            <div>{children}</div>
            <div className="flex items-center">
                <button onClick={() => removeField(item.id)} className="mr-2 bg-red-500 text-white p-1 rounded-md">Remove</button>
                <ReorderIcon
                    dragControls={dragControls}
                    isActive={isDragging || pressed}
                    onPress={() => setPressed(true)}
                />
            </div>
        </Reorder.Item>
    );
};

interface ReorderIconProps {
    dragControls: DragControls;
    isActive: boolean;
    onPress: () => void;
}

export function ReorderIcon({ dragControls, isActive, onPress }: ReorderIconProps) {
    return (
        <motion.button
            type="button"
            aria-label="Reorder"
            animate={{ scale: isActive ? 0.85 : 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            onPointerDown={(e) => {
                e.preventDefault();
                onPress();
                dragControls.start(e);
            }}
            className="cursor-grab active:cursor-grabbing"
            style={{ touchAction: 'none' }}
        >
            <svg
                xmlns='http://www.w3.org/2000/svg'
                // viewBox='0 0 35 35'
                width='15'
                height='15'
                className='fill-primary-foreground'
            >
                <circle cx="3" cy="3" r="1.5" />
                <circle cx="8" cy="3" r="1.5" />
                <circle cx="13" cy="3" r="1.5" />
                <circle cx="3" cy="8" r="1.5" />
                <circle cx="8" cy="8" r="1.5" />
                <circle cx="13" cy="8" r="1.5" />
                <circle cx="3" cy="13" r="1.5" />
                <circle cx="8" cy="13" r="1.5" />
                <circle cx="13" cy="13" r="1.5" />

            </svg>
        </motion.button>
    );
}

const inactiveShadow = '0px 0px 0px rgba(0,0,0,0.8)';

export function useRaisedShadow(value: MotionValue<number>) {
    const boxShadow = useMotionValue(inactiveShadow);

    useEffect(() => {
        let isActive = false;
        value.onChange((latest) => {
            const wasActive = isActive;
            if (latest !== 0) {
                isActive = true;
                if (isActive !== wasActive) {
                    animate(boxShadow, '5px 5px 10px rgba(0,0,0,0.3)');
                }
            } else {
                isActive = false;
                if (isActive !== wasActive) {
                    animate(boxShadow, inactiveShadow);
                }
            }
        });
    }, [value, boxShadow]);

    return boxShadow;
}

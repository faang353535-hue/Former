'use client';
import React, { useState } from 'react';
import { StarRating } from '../actions/Add/starrating';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/api';
import { Alerter } from './alerter';

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
    formId: string;
}

type ResponseValue = string | number | boolean;

export const Preview = ({ formName, backgroundColor, fontColor = 'black', fields, formId }: PreviewProps) => {

    const initialResponses = fields.reduce((acc, field) => {
        if (field.type === 'checkbox') {
            acc[field.title] = false;
        } else {
            acc[field.title] = '';
        }
        return acc;
    }, {} as Record<string, ResponseValue>);

    const [responses, setResponses] = useState<Record<string, ResponseValue>>(initialResponses);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');

    const handleInputChange = (fieldTitle: string, value: ResponseValue) => {
        setResponses(prev => ({ ...prev, [fieldTitle]: value }));
    };

    const onCheckedChange = (fieldTitle: string, value: boolean) => {
        setResponses(prev => ({ ...prev, [fieldTitle]: value }));
    }

    const dataSender = async (response: any) => {
        for (const field of fields) {
            const value = response[field.title];
            if (['text', 'number', 'text Area'].includes(field.type)) {
                if (value === '' || (typeof value === 'string' && value.trim() === '')) {
                    setDialogTitle("Validation Error");
                    setDialogMessage(`The field "${field.title}" cannot be empty.`);
                    setShowDialog(true);
                    return;
                }
            }
        }

        console.log("Form Responses:", response);

        try {
            if (!response) {
                setDialogTitle("Submission Error");
                setDialogMessage("Response data is incomplete.");
                setShowDialog(true);
                return;
            }
            const payload = {
                formId: parseInt(formId, 10),
                response_data: response
            }
            if (isNaN(payload.formId)) {
                setDialogTitle("Submission Error");
                setDialogMessage("Invalid Form ID.");
                setShowDialog(true);
                return;
            }
            const formData = await authApi.getResponse(payload);
            setDialogTitle("Success!");
            setDialogMessage("Form submitted successfully!");
            setShowDialog(true);
            return formData;
        } catch (error) {
            console.error('Failed to fetch form:', error);
            setDialogTitle("Submission Error");
            setDialogMessage("Failed to submit form. Please try again.");
            setShowDialog(true);
            return undefined;
        }
    };


    const renderField = (item: ItemType) => {
        switch (item.type) {
            case 'text':
                return (
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor={item.id.toString()} style={{ color: fontColor }}>{item.title}</Label>
                        <Input
                            type="text"
                            id={item.id.toString()}
                            placeholder={item.title || 'Text Input'}
                            value={responses[item.title] as string || ''}
                            onChange={(e) => handleInputChange(item.title, e.target.value)}
                        />
                    </div>
                );
            case 'number':
                return (
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor={item.id.toString()} style={{ color: fontColor }}>{item.title}</Label>
                        <Input
                            type="number"
                            id={item.id.toString()}
                            placeholder={item.title || 'Number Input'}
                            value={responses[item.title] as number || ''}
                            onChange={(e) => handleInputChange(item.title, e.target.value)}
                        />
                    </div>
                );
            case 'checkbox':
                return (
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id={item.id.toString()}
                            checked={responses[item.title] as boolean || false}
                            onCheckedChange={(checked: boolean) => onCheckedChange(item.title, checked)}
                        />
                        <Label
                            htmlFor={item.id.toString()}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            style={{ color: fontColor }}
                        >
                            {item.title || 'Checkbox'}
                        </Label>
                    </div>
                );
            case 'rating':
                return (
                    <div className="flex items-center">
                        <Label className="mr-2" style={{ color: fontColor }}>{item.title || 'Rating'}</Label>
                        <StarRating
                            rating={responses[item.title] as number || 0}
                            onRatingChange={(rating) => handleInputChange(item.title, rating)}
                        />
                    </div>
                );
            case 'text Area':
                return (
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor={item.id.toString()} style={{ color: fontColor }}>{item.title}</Label>
                        <Textarea
                            id={item.id.toString()}
                            placeholder={`Enter your ${item.title.toLowerCase()} here...`}
                            value={responses[item.title] as string || ''}
                            onChange={(e) => handleInputChange(item.title, e.target.value)}
                        />
                    </div>
                );
            default:
                return (
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor={item.id.toString()} style={{ color: fontColor }}>{item.title}</Label>
                        <Input
                            type="text"
                            id={item.id.toString()}
                            placeholder={item.title || 'Text Input'}
                            value={responses[item.title] as string || ''}
                            onChange={(e) => handleInputChange(item.title, e.target.value)}
                        />
                    </div>
                );
        }
    };

    return (
        <div className="p-6 border rounded-lg shadow-lg w-full" style={{ backgroundColor: backgroundColor || 'white', color: fontColor }}>
            <h2 className="text-3xl font-bold mb-6 text-center">{formName || 'Form Preview'}</h2>
            <form
                className="space-y-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    dataSender(responses)
                }}
            >
                {fields.map(field => (
                    <div key={field.id}>
                        {renderField(field)}
                    </div>
                ))}
                {fields.length > 0 && <Button type="submit" className="w-full">Submit</Button>}
            </form>
            <Alerter
                open={showDialog}
                onOpenChange={setShowDialog}
                title={dialogTitle}
                message={dialogMessage}
            />
        </div>
    );
};
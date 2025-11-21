'use client'
import { useEffect, useState } from "react"
import MoveIndex, { ItemType } from "./dragablemanu"
import { Preview } from "./Preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ColorPicker } from "@/components/ui/color-picker"
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export interface FormType {
    name: string,
    backgroundColor: string,
    fontColor?: string,
    fields: ItemType[]
}

const Add = () => {
    const router = useRouter();
    const [formName, setFormName] = useState("My Form");
    const [color, setColor] = useState("#ffffff");
    const [fontColor, setFontColor] = useState<string>('black');
    const [items, setItems] = useState<ItemType[]>([]);
    const [formFields, setFormFields] = useState<FormType | null>(null);

    const colortracker = (e: React.ChangeEvent<HTMLInputElement>) => {
        setColor(e.target.value);
    }

    const setFontColorHandler = (value: string) => {
        setFontColor(value);
    }

    const addField = (type: string) => {
        const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
        const newItem: ItemType = {
            id: newId,
            title: '',
            type: type,
            rating: type === 'rating' ? 0 : undefined,
        };
        setItems([...items, newItem]);
    };

    const removeField = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    const updateItem = (id: number, updatedProperties: Partial<ItemType>) => {
        setItems(items.map(item => {
            if (item.id === id) {
                return { ...item, ...updatedProperties };
            }
            return item;
        }));
    };

    useEffect(() => {
        setFormFields({
            name: formName,
            backgroundColor: color,
            fontColor: fontColor,
            fields: items
        })
    }, [formName, color, items, fontColor]);

    const submit = async () => {
        try {
            console.log("forn save in process");
            const { authApi } = await import('@/lib/api');
            await authApi.formCreate(formFields);
            alert("Form Created Successfully!");
            router.push('/cards');
        }
        catch (err: any) {
            const errorMessage = err || 'Form creation failed. Please try again.';
            alert(errorMessage);
        }
    }

    return (
        <div className="grid md:grid-cols-2 gap-8 p-4 md:p-8 md:pt-20 min-h-screen">
            {/* Left Column: Form Builder */}
            <Card className="flex flex-col">
                <CardHeader className="flex flex-row items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <CardTitle>Form Builder</CardTitle>
                        <CardDescription>Create and customize your form</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-6 overflow-y-auto">
                    <div className="space-y-2">
                        <Label htmlFor="namefield">Form Name</Label>
                        <Input id="namefield" type="text" value={formName} onChange={(e) => setFormName(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label >Background</Label>
                            <div className="relative">
                                {/* <Input id="colorpicker" type="color" value={color} onChange={colortracker} className=" " /> */}
                                <ColorPicker color={`${color}`} onChange={(color) => { setColor(color) }} isEyeDroppper={true} className="h-10 w-full p-1 rounded-[10px] shadow-[inset_0px_0px_0px_3px_rgba(0,0,0,0.32)] dark:shadow-[inset_0px_0px_0px_3px_rgba(255,255,255,0.32)] " />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Font Color</Label>
                            <div className="flex gap-2 items-center">
                                <button
                                    type="button"
                                    onClick={() => setFontColorHandler('black')}
                                    aria-label="Black font"
                                    className={`w-10 h-10 rounded-md border-2 ${fontColor === 'black' ? 'ring-2 ring-offset-2 ring-ring' : ''}`}
                                    style={{ backgroundColor: 'black' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setFontColorHandler('white')}
                                    aria-label="White font"
                                    className={`w-10 h-10 rounded-md border-2 ${fontColor === 'white' ? 'ring-2 ring-offset-2 ring-ring' : 'border-input'}`}
                                    style={{ backgroundColor: 'white' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label className="text-lg font-semibold">Form Fields</Label>
                        <MoveIndex items={items} setItems={setItems} addField={addField} removeField={removeField} updateItem={updateItem} />
                    </div>
                </CardContent>
                <CardFooter>
                    {/* <Button className="w-full" onClick={submit}>Save Form</Button> */}
                    <Button className="w-full" variant={"outline"}  onClick={submit}>Save Form</Button>
                </CardFooter>
            </Card>

            {/* Right Column: Preview */}
            <div className="bg-muted rounded-lg p-4 flex items-center justify-center">
                <div className="w-full max-w-md">
                    <Preview formName={formName} backgroundColor={color} fontColor={fontColor} fields={items} />
                </div>
            </div>
        </div>
    )
}

export default Add
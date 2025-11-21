import { Preview } from '@/app/forms/preview';
import { authApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';

interface Field {
    id: number;
    title: string;
    type: string;
    rating?: number;
}

interface CardData {
    id: number;
    form_data: {
        name: string;
        fields: Field[];
        fontColor?: string;
        backgroundColor: string;
    };
}

const getFormData = async (id: string): Promise<CardData | undefined> => {
    try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading
        const formId = parseInt(id, 10);
        if (isNaN(formId)) {
            console.error('Invalid form ID:', id);
            return undefined;
        }
        const formData = await authApi.getForm(formId);
        return formData;
    } catch (error) {
        console.error('Failed to fetch form:', error);
        return undefined;
    }
};

interface FormPageProps {
    params: Promise<{ id: string }>;
}

async function FormContent({ id }: { id: string }) {
    const formData = await getFormData(id);

    if (!formData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Form Not Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>The form you are looking for does not exist or could not be loaded.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="pt-20 flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
            <div className="w-full max-w-md">
                <Preview
                    formName={formData.form_data.name}
                    backgroundColor={formData.form_data.backgroundColor}
                    fontColor={formData.form_data.fontColor}
                    fields={formData.form_data.fields}
                    formId={id}
                />
            </div>
        </div>
    );
}

function FormSkeleton() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
            <div className="p-6 border rounded-lg shadow-lg w-full max-w-md" style={{ backgroundColor: 'white' }}>
                <Skeleton className="h-8 w-3/4 mb-6" />
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-6 w-6 rounded" />
                        <Skeleton className="h-4 w-1/3" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        </div>
    );
}

export default async function FormPage({ params }: FormPageProps) {
    const { id } = await params;

    return (
        <Suspense fallback={<FormSkeleton />}>
            <FormContent id={id} />
        </Suspense>
    );
}
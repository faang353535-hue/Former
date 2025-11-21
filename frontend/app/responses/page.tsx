'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Response {
    id: number;
    response_data: any;
}

function ResponsesPageContent() {
    const searchParams = useSearchParams();
    const formId = searchParams.get('formId');
    const [responses, setResponses] = useState<Response[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (formId) {
            const fetchResponses = async () => {
                try {
                    setLoading(true);
                    const data = await authApi.formResponses(formId);
                    setResponses(data);
                    setError(null);
                } catch (err) {
                    setError('Failed to fetch responses.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchResponses();
        } else {
            setError('Form ID is missing.');
            setLoading(false);
        }
    }, [formId]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    const headers = responses.length > 0 ? Object.keys(responses[0].response_data) : [];

    return (
        <div className="container mx-auto pt-24 ">
            <Card>
                <CardHeader>
                    <CardTitle>Form Responses</CardTitle>
                </CardHeader>
                <CardContent>
                    {responses.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Response ID</TableHead>
                                    {headers.map(header => (
                                        <TableHead key={header}>{header}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {responses.map(response => (
                                    <TableRow key={response.id}>
                                        <TableCell>{response.id}</TableCell>
                                        {headers.map(header => (
                                            <TableCell key={`${response.id}-${header}`}>
                                                {JSON.stringify(response.response_data[header])}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p>No responses found for this form.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default function ResponsesPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <ResponsesPageContent />
        </Suspense>
    );
}

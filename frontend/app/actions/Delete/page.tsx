'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Form {
  id: number;
  userId: number;
  form_data: {
    name: string;
    fields: {
      id: number;
      type: string;
      title: string;
      rating?: number;
    }[];
    fontColor?: string;
    backgroundColor: string;
  };
}

const DeletePage = () => {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForms, setSelectedForms] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await authApi.getForms();
        setForms(response.data);
      } catch (error) {
        console.error('Error fetching forms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);
  console.log(forms)

  const toggleFormSelection = (formId: number) => {
    const newSelection = new Set(selectedForms);
    if (newSelection.has(formId)) {
      newSelection.delete(formId);
    } else {
      newSelection.add(formId);
    }
    setSelectedForms(newSelection);
  };

  const handleDelete = async () => {
    if (selectedForms.size === 0) {
      alert('Please select at least one form to delete.');
      return;
    }

    try {
      await authApi.deleteForms(Array.from(selectedForms));
      setForms(forms.filter(form => !selectedForms.has(form.id)));
      setSelectedForms(new Set());
      alert('Forms deleted successfully!');
    } catch (error) {
      console.error('Error deleting forms:', error);
      alert('Failed to delete forms. Please try again.');
    }
  };

  return (
    <div className="pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Delete Forms</h1>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={selectedForms.size === 0}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected ({selectedForms.size})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  form and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {loading ? (
          <p>Loading forms...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map(form => (
              <Card
                key={form.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedForms.has(form.id)
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
                    : 'hover:border-gray-300'
                }`}
                onClick={() => toggleFormSelection(form.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {form.form_data.name}
                    <Checkbox
                      checked={selectedForms.has(form.id)}
                      onCheckedChange={() => toggleFormSelection(form.id)}
                    />
                  </CardTitle>
                </CardHeader>
                {/* <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">{form.description}</p>
                </CardContent> */}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeletePage;
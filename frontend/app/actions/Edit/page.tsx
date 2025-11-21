'use client'

import React, { useState, useEffect } from 'react';
import { authApi } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

interface Card {
  id: number;
  form_data: {
    name: string;
    fields: {
      id: number;
      title: string;
      type: string;
      rating?: number;
    }[];
    fontColor?: string;
    backgroundColor: string;
  };
}

const Edit = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedId, setSelectedId] = useState<number>()

  const [formData, setFormData] = useState<Card['form_data']>({
    name: '',
    fields: [],
    backgroundColor: '#ffffff',
    fontColor: 'black',
  });

  const getForms = async () => {
    try {
      setLoading(true);
      const response = await authApi.getForms();
      setCards(response.data);
      console.log(response.data);

    } catch (err) {
      console.error("Failed to fetch forms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getForms();
  }, []);

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
    setFormData({
      ...card.form_data,
      fields: card.form_data.fields || [],
    });
    setSelectedId(card.id)
    console.log(selectedId);

  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFontColorChange = (color: string) => {
    setFormData(prev => ({
      ...prev,
      fontColor: color,
    }));
  };

  const handleFieldChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFields = [...formData.fields];
    newFields[index] = { ...newFields[index], [name]: value };
    setFormData(prev => ({ ...prev, fields: newFields }));
  };

  const addField = () => {
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, { id: Date.now(), title: 'New Field', type: 'text' }],
    }));
  };

  const removeField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCard) return;

        const updatePayload = {
          id: selectedCard.id,
          form_data: {
            ...selectedCard.form_data, 
            ...formData,
          },
        };
    try {
      console.log(updatePayload);

      await authApi.updateForm(selectedCard.id, updatePayload);

      alert('Card updated successfully!');
      getForms();
      setSelectedCard(null);
    } catch (error) {
      console.error('Failed to update card:', error);
      alert('Failed to update card. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Card</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Select a Card to Edit</h2>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-24 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {cards.map(card => (
                <div
                  key={card.id}
                  className={`p-4 border rounded-lg cursor-pointer ${selectedCard?.id === card.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' : 'border-gray-200'
                    }`}
                  onClick={() => handleCardSelect(card)}
                >
                  <h3 className="font-semibold">{card.form_data.name}</h3>
                  <p className="text-sm text-gray-500">ID: {card.id}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedCard && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Edit Card Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="backgroundColor" className="block text-sm font-medium mb-1">Background Color</label>
                  <input
                    type="color"
                    id="backgroundColor"
                    name="backgroundColor"
                    value={formData.backgroundColor}
                    onChange={handleInputChange}
                    className="w-full p-1 h-10 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Font Color</label>
                  <div className="flex gap-2 items-center">
                    <button
                      type="button"
                      onClick={() => handleFontColorChange('black')}
                      aria-label="Black font"
                      className={`w-8 h-8 rounded-sm border ${formData.fontColor === 'black' ? 'ring-2 ring-offset-1 ring-blue-400' : 'border-gray-300'}`}
                      style={{ backgroundColor: 'black' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleFontColorChange('white')}
                      aria-label="White font"
                      className={`w-8 h-8 rounded-sm border ${formData.fontColor === 'white' ? 'ring-2 ring-offset-1 ring-blue-400' : 'border-gray-300'}`}
                      style={{ backgroundColor: 'white' }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Fields</h3>
                <div className="space-y-3">
                  {formData.fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2 p-2 border rounded-lg">
                      <input
                        type="text"
                        name="title"
                        value={field.title}
                        onChange={(e) => handleFieldChange(index, e)}
                        className="w-full p-2 border rounded-md dark:bg-gray-700"
                        placeholder="Field Title"
                      />
                      <select
                        name="type"
                        value={field.type}
                        onChange={(e) => handleFieldChange(index, e)}
                        className="p-2 border rounded-md dark:bg-gray-700"
                      >
                        <option value="text">Text</option>
                        <option value="email">Email</option>
                        <option value="number">Number</option>
                        <option value="rating">Rating</option>
                      </select>
                      <button type="button" onClick={() => removeField(index)} className="text-red-500 hover:text-red-700 p-2">✕</button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addField} className="mt-2 text-blue-500 hover:text-blue-600">
                  + Add Field
                </button>
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Edit;
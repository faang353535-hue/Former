import prisma from '../../lib/prisma.js';

export const getForm = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Form ID is required' });
    }

    const formId = parseInt(id, 10);
    if (isNaN(formId)) {
      return res.status(400).json({ error: 'Invalid Form ID' });
    }

    const form = await prisma.forms.findUnique({
      where: { id: formId },
    });

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    res.status(200).json(form);

  } catch (error) {
    console.error("Error fetching form:", error);
    res.status(500).json({ error: "Failed to fetch form" });
  }
};

export const saveResponse = async (req, res) => {
  const { formId, response_data } = req.body;

  if (!formId || !response_data) {
    return res.status(400).json({ message: 'formId and response_data are required' });
  }

  try {
    const response = await prisma.response.create({
      data: {
        formId,
        response_data,
      },
    });
    res.status(201).json({ message: "Thank you for your response" });
  } catch (error) {
    console.error('Error saving response:', error);
    res.status(500).json({ message: 'Error saving response' });
  }
};

export const getResponses = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Form ID is required' });
    }

    const fId = parseInt(id, 10);
    if (isNaN(fId)) {
      return res.status(400).json({ error: 'Invalid Form ID' });
    }

    const form = await prisma.response.findMany({
      where: { formId: fId },
    });

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    res.status(200).json(form);

  } catch (error) {
    console.error("Error fetching form:", error);
    res.status(500).json({ error: "Failed to fetch form.." });
  }
};
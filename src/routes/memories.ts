import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/memories', async () => {
    try {
      const memories = await prisma.memory.findMany({
        orderBy: {
          createdAt: 'asc',
        },
      });

      return memories.map((memory) => ({
        id: memory.id,
        coverURL: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat('...'),
      }));
    } catch (error) {
      // Handle errors and return an appropriate response
      return { error: 'An error occurred while fetching memories.' };
    }
  });

  app.get('/memories/:id', async (request) => {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = paramsSchema.parse(request.params);

      const memory = await prisma.memory.findUnique({
        where: {
          id,
        },
      });

      if (!memory) {
        // Handle the case where the memory with the given ID was not found
        return { error: 'Memory not found.' };
      }

      return memory;
    } catch (error) {
      // Handle errors and return an appropriate response
      return { error: 'An error occurred while fetching the memory.' };
    }
  });

  app.post('/memories', async (request) => {
    try {
      const bodySchema = z.object({
        content: z.string(),
        coverURL: z.string(),
        isPublic: z.boolean().default(false),
      });

      const { content, coverURL, isPublic } = bodySchema.parse(request.body);

      const memory = await prisma.memory.create({
        data: {
          content,
          coverUrl: coverURL, // Use the correct property name
          isPublic,
          userId: '9af59216-0ecd-4ba4-a08e-e15dfd2cad76',
        },
      });

      return memory;
    } catch (error) {
      // Handle errors and return an appropriate response
      return { error: 'An error occurred while creating the memory.' };
    }
  });

  app.put('/memories/:id', async (request) => {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = paramsSchema.parse(request.params);

      const bodySchema = z.object({
        content: z.string(),
        coverURL: z.string(),
        isPublic: z.boolean().default(false),
      });

      const { content, coverURL, isPublic } = bodySchema.parse(request.body);

      const memory = await prisma.memory.update({
        where: {
          id,
        },
        data: {
          content,
          coverUrl: coverURL, // Use the correct property name
          isPublic,
        },
      });

      return memory;
    } catch (error) {
      // Handle errors and return an appropriate response
      return { error: 'An error occurred while updating the memory.' };
    }
  });

  app.delete('/memories/:id', async (request) => {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = paramsSchema.parse(request.params);

      await prisma.memory.delete({
        where: {
          id,
        },
      });

      // Return a success message or status code upon successful deletion
      return { message: 'Memory deleted successfully.' };
    } catch (error) {
      // Handle errors and return an appropriate response
      return { error: 'An error occurred while deleting the memory.' };
    }
  });
}

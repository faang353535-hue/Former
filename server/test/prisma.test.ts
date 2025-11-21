import prisma from '../lib/prisma.js'

async function main() {
  try {
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User'
      }
    })
    console.log('Created user:', user)
    
    const users = await prisma.user.findMany()
    console.log('All users:', users)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function main() {
    console.log('Seeding database...')

    // Clear existing data
    await prisma.payment.deleteMany()
    await prisma.invoice.deleteMany()
    await prisma.order.deleteMany()
    await prisma.message.deleteMany()
    await prisma.conversation.deleteMany()

    // Seed Orders
    const order1 = await prisma.order.create({
        data: {
            id: 'ORD-101',
            customerEmail: 'customer@example.com',
            status: 'DELIVERED',
            trackingNumber: 'TRK123456',
            totalAmount: 150.00,
            items: JSON.stringify([
                { name: 'Wireless Headphones', price: 100, quantity: 1 },
                { name: 'USB-C Cable', price: 25, quantity: 2 }
            ]),
            estimatedArrival: new Date('2024-01-15'),
        }
    })

    const order2 = await prisma.order.create({
        data: {
            id: 'ORD-102',
            customerEmail: 'customer@example.com',
            status: 'SHIPPED',
            trackingNumber: 'TRK789012',
            totalAmount: 89.99,
            items: JSON.stringify([
                { name: 'Mechanical Keyboard', price: 89.99, quantity: 1 }
            ]),
            estimatedArrival: new Date('2024-02-20'),
        }
    })

    // Seed Invoices
    await prisma.invoice.create({
        data: {
            id: 'INV-201',
            orderId: order1.id,
            amount: 150.00,
            status: 'PAID',
            dueDate: new Date('2024-01-20'),
        }
    })

    await prisma.invoice.create({
        data: {
            id: 'INV-202',
            orderId: order2.id,
            amount: 89.99,
            status: 'UNPAID',
            dueDate: new Date('2024-02-25'),
        }
    })

    // Seed Payments
    await prisma.payment.create({
        data: {
            id: 'PAY-301',
            invoiceId: 'INV-201',
            amount: 150.00,
            status: 'SUCCESS',
            paymentMethod: 'CREDIT_CARD',
        }
    })

    console.log('Database seeded successfully!')
}

// main()
//     .catch((e) => {
//         console.error(e)
//         process.exit(1)
//     })
//     .finally(async () => {
//         await prisma.$disconnect()
//     })

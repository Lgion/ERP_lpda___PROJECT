import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

dotenv.config();

const require = createRequire(import.meta.url);
const { PrismaClient } = require('@prisma/client');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// --- API ROUTES ---

// PRODUCTS
app.get('/api/products', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: { family: true }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const { ref, name, price, stock, minStock, vat, familyId, image, cloudinaryId } = req.body;
        const product = await prisma.product.create({
            data: {
                ref, name, price: parseFloat(price), stock: parseInt(stock), minStock: parseInt(minStock), vat: parseFloat(vat),
                familyId: parseInt(familyId),
                image, cloudinaryId,
                status: parseInt(stock) > 0 ? 'available' : 'out_of_stock'
            },
            include: { family: true }
        });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { family: true }
        });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const { ref, name, price, stock, minStock, vat, familyId, image, cloudinaryId } = req.body;
        const product = await prisma.product.update({
            where: { id: parseInt(req.params.id) },
            data: {
                ref, name,
                price: price !== undefined ? parseFloat(price) : undefined,
                stock: stock !== undefined ? parseInt(stock) : undefined,
                minStock: minStock !== undefined ? parseInt(minStock) : undefined,
                vat: vat !== undefined ? parseFloat(vat) : undefined,
                familyId: familyId !== undefined ? parseInt(familyId) : undefined,
                image, cloudinaryId,
                status: stock !== undefined ? (parseInt(stock) > 0 ? 'available' : 'out_of_stock') : undefined
            },
            include: { family: true }
        });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CLOUDINARY UPLOAD
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'gestomag_products'
        });

        // Clean up local file
        // fs.unlinkSync(req.file.path); 

        res.json({
            url: result.secure_url,
            publicId: result.public_id
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// FAMILIES
app.get('/api/families', async (req, res) => {
    try {
        const families = await prisma.family.findMany({ include: { _count: { select: { products: true } } } });
        res.json(families);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/families', async (req, res) => {
    try {
        const { code, label, image } = req.body;
        const family = await prisma.family.create({
            data: { code, label, image }
        });
        res.json(family);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/families/:id', async (req, res) => {
    try {
        const { code, label, image } = req.body;
        const family = await prisma.family.update({
            where: { id: parseInt(req.params.id) },
            data: { code, label, image }
        });
        res.json(family);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/families/:id', async (req, res) => {
    try {
        await prisma.family.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SUPPLIERS
app.get('/api/suppliers', async (req, res) => {
    const suppliers = await prisma.supplier.findMany();
    res.json(suppliers);
});

app.post('/api/suppliers', async (req, res) => {
    try {
        const { name, contact, phone, email, city } = req.body;
        const supplier = await prisma.supplier.create({
            data: { name, contact, phone, email, city }
        });
        res.json(supplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/suppliers/:id', async (req, res) => {
    try {
        const supplier = await prisma.supplier.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
        res.json(supplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/suppliers/:id', async (req, res) => {
    try {
        const { name, contact, phone, email, city } = req.body;
        const supplier = await prisma.supplier.update({
            where: { id: parseInt(req.params.id) },
            data: { name, contact, phone, email, city }
        });
        res.json(supplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/suppliers/:id', async (req, res) => {
    try {
        // Check if supplier has arrivals
        const arrivalsCount = await prisma.arrival.count({
            where: { supplierId: parseInt(req.params.id) }
        });
        if (arrivalsCount > 0) {
            return res.status(400).json({ error: 'Impossible de supprimer : ce fournisseur a des arrivages associés' });
        }
        await prisma.supplier.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CLIENTS
app.get('/api/clients', async (req, res) => {
    const clients = await prisma.client.findMany();
    res.json(clients);
});

app.post('/api/clients', async (req, res) => {
    try {
        const { name, type, phone, city } = req.body;
        const client = await prisma.client.create({
            data: { name, type, phone, city }
        });
        res.json(client);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/clients/:id', async (req, res) => {
    try {
        const client = await prisma.client.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        if (!client) return res.status(404).json({ error: 'Client not found' });
        res.json(client);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/clients/:id', async (req, res) => {
    try {
        const { name, type, phone, city } = req.body;
        const client = await prisma.client.update({
            where: { id: parseInt(req.params.id) },
            data: { name, type, phone, city }
        });
        res.json(client);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/clients/:id', async (req, res) => {
    try {
        await prisma.client.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ARRIVALS
app.get('/api/arrivals', async (req, res) => {
    try {
        const arrivals = await prisma.arrival.findMany({
            include: {
                supplier: true,
                lines: {
                    include: { product: true }
                }
            },
            orderBy: { date: 'desc' }
        });
        res.json(arrivals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/arrivals/:id', async (req, res) => {
    try {
        const arrival = await prisma.arrival.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                supplier: true,
                lines: {
                    include: { product: true }
                }
            }
        });
        if (!arrival) return res.status(404).json({ error: 'Arrival not found' });
        res.json(arrival);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/arrivals', async (req, res) => {
    try {
        const { date, reference, supplierId, lines } = req.body;

        // Calculate total amount
        const totalAmount = lines.reduce((sum, line) => sum + (line.quantity * line.unitPrice), 0);

        // Create arrival with lines in a transaction
        const arrival = await prisma.$transaction(async (tx) => {
            // Create the arrival
            const newArrival = await tx.arrival.create({
                data: {
                    date: new Date(date),
                    reference,
                    supplierId: parseInt(supplierId),
                    totalAmount,
                    lines: {
                        create: lines.map(line => ({
                            productId: parseInt(line.productId),
                            quantity: parseInt(line.quantity),
                            unitPrice: parseFloat(line.unitPrice)
                        }))
                    }
                },
                include: {
                    supplier: true,
                    lines: { include: { product: true } }
                }
            });

            // Update stock for each product
            for (const line of lines) {
                await tx.product.update({
                    where: { id: parseInt(line.productId) },
                    data: {
                        stock: { increment: parseInt(line.quantity) },
                        status: 'available'
                    }
                });
            }

            return newArrival;
        });

        res.json(arrival);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/arrivals/:id', async (req, res) => {
    try {
        // First get the arrival with lines to reverse stock
        const arrival = await prisma.arrival.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { lines: true }
        });

        if (!arrival) return res.status(404).json({ error: 'Arrival not found' });

        await prisma.$transaction(async (tx) => {
            // Reverse stock changes
            for (const line of arrival.lines) {
                const product = await tx.product.update({
                    where: { id: line.productId },
                    data: { stock: { decrement: line.quantity } }
                });
                // Update status if stock becomes 0
                if (product.stock <= 0) {
                    await tx.product.update({
                        where: { id: line.productId },
                        data: { status: 'out_of_stock' }
                    });
                }
            }

            // Delete lines first (foreign key constraint)
            await tx.arrivalLine.deleteMany({ where: { arrivalId: arrival.id } });

            // Delete arrival
            await tx.arrival.delete({ where: { id: arrival.id } });
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SEED (For dev convenience)
app.post('/api/seed', async (req, res) => {
    // Basic seed if db empty
    const count = await prisma.family.count();
    if (count === 0) {
        await prisma.family.createMany({
            data: [
                { code: 'FAM-STAT', label: 'Statues' },
                { code: 'FAM-CHAP', label: 'Chapelets' },
                { code: 'FAM-LIVR', label: 'Librairie' },
                { code: 'FAM-ICON', label: 'Icônes' }
            ]
        });
        res.json({ message: 'Seeded families' });
    } else {
        res.json({ message: 'Already seeded' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

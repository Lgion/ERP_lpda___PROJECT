
import fs from 'fs';
import mongoose from 'mongoose';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('MONGODB_URI is not defined in environment variables.');
    process.exit(1);
}

// Define Schemas inline to avoid ESM/CJS import issues with project models
const familySchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    image: { type: String, default: null }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    ref: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    minStock: { type: Number, default: 0 },
    vat: { type: Number, default: 0 },
    status: { type: String, enum: ['available', 'out_of_stock'], default: 'available' },
    image: { type: String, default: null },
    cloudinaryId: { type: String, default: null },
    familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'GestomagFamily', required: true }
}, { timestamps: true });

const Family = mongoose.models.GestomagFamily || mongoose.model('GestomagFamily', familySchema);
const Product = mongoose.models.GestomagProduct || mongoose.model('GestomagProduct', productSchema);

async function main() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri);
        console.log('Connected.');

        const pdfPath = 'public/ETAT_IMPRIME_STOCK_PAR_FAMILLE.PDF';
        const dataBuffer = fs.readFileSync(pdfPath);
        console.log('Parsing PDF...');
        const data = await pdf(dataBuffer);

        const lines = data.text.split('\n');
        let currentFamily = null;
        let productsAdded = 0;

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (!line) continue;

            // Check for Family
            if (line.startsWith('FAMILLE DU PRODUIT :')) {
                const familyName = line.replace('FAMILLE DU PRODUIT :', '').trim();
                // Upsert Family
                let family = await Family.findOne({ label: familyName });
                if (!family) {
                    // Create code from name (First 3 chars + random)
                    const code = (familyName.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 1000)).replace(/[^A-Z0-9]/g, '');
                    family = await Family.create({
                        code: code,
                        label: familyName
                    });
                    console.log(`Created Family: ${familyName}`);
                }
                currentFamily = family;
                continue;
            }

            // Skip headers
            if (line.includes('DESIGNATION DES PRODUITSSTOCK') || line.includes('STOCK DES PRODUITS')) continue;
            // Skip page numbers and dates
            if (/^\d+\s*\/\s*\d+$/.test(line)) continue;
            if (/^\d{2}\/\d{2}\/\d{4}/.test(line)) continue;

            // Parse Product Line
            // Format: NAME...STOCK
            // Stock is usually at the end like "2,00"
            // Regex to find trailing number
            const match = line.match(/^(.*?)(\d+(?:\s\d+)*,\d{2})$/);

            if (match && currentFamily) {
                let name = match[1].trim();
                let stockStr = match[2].replace(/\s/g, '').replace(',', '.');
                let stock = parseFloat(stockStr);

                if (name && !isNaN(stock)) {
                    // Generate Ref
                    const ref = `IMP-${Date.now()}-${productsAdded}`;

                    // Check if product exists (by name and family?)
                    // For now, let's assume we just add them. Or upsert by name?
                    // Upsert by name to avoid duplicates if run multiple times

                    const existingProduct = await Product.findOne({ name: name, familyId: currentFamily._id });

                    if (existingProduct) {
                        existingProduct.stock = stock;
                        existingProduct.status = stock > 0 ? 'available' : 'out_of_stock';
                        await existingProduct.save();
                        // console.log(`Updated: ${name} -> ${stock}`);
                    } else {
                        await Product.create({
                            ref: ref,
                            name: name,
                            stock: stock,
                            familyId: currentFamily._id,
                            status: stock > 0 ? 'available' : 'out_of_stock'
                        });
                        // console.log(`Added: ${name} -> ${stock}`);
                        productsAdded++;
                    }
                }
            }
        }

        console.log(`Finished processing. New products added: ${productsAdded}`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

main();

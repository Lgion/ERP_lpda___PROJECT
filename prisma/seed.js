import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const familiesData = [
  {
    code: 'FAM-BIBLES',
    label: 'Bibles et Nouveaux Testaments',
    products: [
      { ref: 'BIBL-001', name: 'Bible de Jérusalem - Reliée cuir', price: 32000, stock: 25, minStock: 5, vat: 18 },
      { ref: 'BIBL-002', name: 'Bible TOB - Édition d’étude', price: 28500, stock: 18, minStock: 4, vat: 18 },
      { ref: 'BIBL-003', name: 'Nouveau Testament illustré enfants', price: 9500, stock: 40, minStock: 10, vat: 5.5 },
      { ref: 'BIBL-004', name: 'Bible liturgique gros caractères', price: 21000, stock: 20, minStock: 6, vat: 18 },
      { ref: 'BIBL-005', name: 'Bible en langue Ewé', price: 19000, stock: 15, minStock: 3, vat: 18 },
      { ref: 'BIBL-006', name: 'Bible de poche bilingue FR-EN', price: 14500, stock: 28, minStock: 7, vat: 18 },
    ],
  },
  {
    code: 'FAM-LIVSPIR',
    label: 'Livres spirituels et catéchétiques',
    products: [
      { ref: 'LIVR-101', name: 'Chemin de croix commenté', price: 6500, stock: 35, minStock: 8, vat: 5.5 },
      { ref: 'LIVR-102', name: 'La vie des Saints illustrée', price: 13500, stock: 22, minStock: 6, vat: 5.5 },
      { ref: 'LIVR-103', name: 'Youcat - Catéchisme des jeunes', price: 9800, stock: 27, minStock: 5, vat: 5.5 },
      { ref: 'LIVR-104', name: 'Agenda liturgique annuel', price: 7500, stock: 45, minStock: 10, vat: 5.5 },
      { ref: 'LIVR-105', name: 'Introduction à la Lectio Divina', price: 8900, stock: 18, minStock: 4, vat: 5.5 },
      { ref: 'LIVR-106', name: 'Rituel du chapelet médité', price: 7200, stock: 26, minStock: 5, vat: 5.5 },
      { ref: 'LIVR-107', name: 'Livre de prières familiales', price: 5600, stock: 32, minStock: 6, vat: 5.5 },
    ],
  },
  {
    code: 'FAM-ROSAIRE',
    label: 'Chapelets et dizainiers',
    products: [
      { ref: 'CHAP-201', name: 'Chapelet en bois d’olivier', price: 4500, stock: 60, minStock: 15, vat: 10 },
      { ref: 'CHAP-202', name: 'Chapelet lumineux phosphorescent', price: 3800, stock: 48, minStock: 12, vat: 10 },
      { ref: 'CHAP-203', name: 'Dizainier élastique perles cristal', price: 3200, stock: 55, minStock: 15, vat: 10 },
      { ref: 'CHAP-204', name: 'Chapelet missionnaire multicolore', price: 4100, stock: 42, minStock: 10, vat: 10 },
      { ref: 'CHAP-205', name: 'Chapelet enfant Marie Immaculée', price: 2900, stock: 65, minStock: 18, vat: 10 },
      { ref: 'CHAP-206', name: 'Bracelet dizainier cuir', price: 5200, stock: 34, minStock: 8, vat: 10 },
      { ref: 'CHAP-207', name: 'Chapelet de la Miséricorde divine', price: 4700, stock: 38, minStock: 9, vat: 10 },
    ],
  },
  {
    code: 'FAM-STATUE',
    label: 'Statues et figurines',
    products: [
      { ref: 'STAT-301', name: 'Statue Vierge Marie 30 cm résine', price: 18500, stock: 20, minStock: 5, vat: 20 },
      { ref: 'STAT-302', name: 'Statue Sacré Cœur de Jésus 40 cm', price: 24500, stock: 15, minStock: 4, vat: 20 },
      { ref: 'STAT-303', name: 'Crèche complète 11 personnages', price: 32500, stock: 10, minStock: 3, vat: 20 },
      { ref: 'STAT-304', name: 'Saint Michel Archange 25 cm', price: 21500, stock: 12, minStock: 3, vat: 20 },
      { ref: 'STAT-305', name: 'Saint Joseph travailleur 20 cm', price: 16200, stock: 18, minStock: 4, vat: 20 },
      { ref: 'STAT-306', name: 'Vierge de Fatima fluorescente', price: 14800, stock: 22, minStock: 5, vat: 20 },
    ],
  },
  {
    code: 'FAM-ICONES',
    label: 'Icônes et images sacrées',
    products: [
      { ref: 'ICON-401', name: 'Icône Russe Vierge de Tendresse 20x15', price: 14500, stock: 28, minStock: 6, vat: 10 },
      { ref: 'ICON-402', name: 'Tableau Dernière Cène sur bois', price: 17500, stock: 16, minStock: 4, vat: 10 },
      { ref: 'ICON-403', name: 'Image pieuse plastifiée Saints Patrons (lot de 50)', price: 6500, stock: 40, minStock: 10, vat: 10 },
      { ref: 'ICON-404', name: 'Icône Saint Benoît bénédiction', price: 11200, stock: 30, minStock: 6, vat: 10 },
      { ref: 'ICON-405', name: 'Triptique Vierge Marie doré', price: 19800, stock: 14, minStock: 3, vat: 10 },
      { ref: 'ICON-406', name: 'Fresque murale Mystères du Rosaire', price: 23500, stock: 9, minStock: 2, vat: 10 },
      { ref: 'ICON-407', name: 'Cadre Petit Prince Jésus dormeur', price: 7600, stock: 26, minStock: 5, vat: 10 },
    ],
  },
  {
    code: 'FAM-BOUGIE',
    label: 'Bougies et encens',
    products: [
      { ref: 'BOUG-501', name: 'Cierge pascal décoré 60 cm', price: 12500, stock: 24, minStock: 6, vat: 5.5 },
      { ref: 'BOUG-502', name: 'Bougies neuvaines parfumées (lot de 6)', price: 9800, stock: 30, minStock: 8, vat: 5.5 },
      { ref: 'BOUG-503', name: 'Encens liturgique grains Bethléem', price: 8200, stock: 40, minStock: 10, vat: 5.5 },
      { ref: 'BOUG-504', name: 'Charbons pour encens (boîte 100)', price: 3600, stock: 55, minStock: 12, vat: 5.5 },
      { ref: 'BOUG-505', name: 'Bougies anniversaire de baptême', price: 4500, stock: 48, minStock: 12, vat: 5.5 },
      { ref: 'BOUG-506', name: 'Encens Notre-Dame de Lourdes', price: 8700, stock: 35, minStock: 9, vat: 5.5 },
    ],
  },
  {
    code: 'FAM-CARTE',
    label: 'Cartes, signets et papeterie',
    products: [
      { ref: 'CART-601', name: 'Cartes de communion dorure (lot de 12)', price: 5400, stock: 45, minStock: 10, vat: 5.5 },
      { ref: 'CART-602', name: 'Signets Saints protecteurs (lot de 20)', price: 3800, stock: 60, minStock: 15, vat: 5.5 },
      { ref: 'CART-603', name: 'Carnet de notes méditatif', price: 3200, stock: 50, minStock: 10, vat: 5.5 },
      { ref: 'CART-604', name: 'Cartes condoléances chrétiennes (lot de 8)', price: 4900, stock: 35, minStock: 8, vat: 5.5 },
      { ref: 'CART-605', name: 'Poster Béatitudes moderne', price: 6100, stock: 28, minStock: 6, vat: 5.5 },
      { ref: 'CART-606', name: 'Planificateur liturgique mural', price: 7800, stock: 22, minStock: 5, vat: 5.5 },
      { ref: 'CART-607', name: 'Cartes saints patrons personnalisables', price: 6900, stock: 30, minStock: 7, vat: 5.5 },
    ],
  },
  {
    code: 'FAM-MEDIA',
    label: 'Supports audio et multimédia',
    products: [
      { ref: 'MEDI-701', name: 'CD chants grégoriens Abbaye de Solesmes', price: 8500, stock: 25, minStock: 6, vat: 10 },
      { ref: 'MEDI-702', name: 'DVD Témoignage Saint Jean-Paul II', price: 9200, stock: 18, minStock: 4, vat: 10 },
      { ref: 'MEDI-703', name: 'Clé USB prières quotidiennes (audio)', price: 11900, stock: 20, minStock: 5, vat: 10 },
      { ref: 'MEDI-704', name: 'CD Berceuses chrétiennes pour enfants', price: 6400, stock: 30, minStock: 8, vat: 10 },
      { ref: 'MEDI-705', name: 'Podcast formation biblique (carte code)', price: 5600, stock: 35, minStock: 9, vat: 10 },
      { ref: 'MEDI-706', name: 'DVD parcours Alpha complet', price: 15800, stock: 12, minStock: 3, vat: 10 },
    ],
  },
];

async function main() {
  console.log('🚿 Réinitialisation de la base...');

  await prisma.arrivalLine.deleteMany();
  await prisma.arrival.deleteMany();
  await prisma.product.deleteMany();
  await prisma.family.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.client.deleteMany();

  console.log('🌱 Insertion des familles et produits...');

  for (const family of familiesData) {
    const createdFamily = await prisma.family.create({
      data: {
        code: family.code,
        label: family.label,
      },
    });

    await prisma.product.createMany({
      data: family.products.map((product) => ({
        ...product,
        familyId: createdFamily.id,
        status: product.stock > 0 ? 'available' : 'out_of_stock',
      })),
    });
  }

  console.log('👥 Création de clients et fournisseurs de base...');

  await prisma.supplier.createMany({
    data: [
      { name: 'Éditions Magnificat', contact: 'Frère Jean', phone: '+228 90 12 34 56', email: 'contact@magnificat.org', city: 'Lomé' },
      { name: 'Art Sacré Saint-Michel', contact: 'Sœur Claire', phone: '+228 91 45 23 78', email: 'vente@artsacre.tg', city: 'Kpalimé' },
      { name: 'Chant et Louange Diffusion', contact: 'M. Damien K.', phone: '+33 1 44 55 66 77', email: 'distribution@chantlouange.fr', city: 'Paris' },
    ],
  });

  await prisma.client.createMany({
    data: [
      { name: 'Paroisse Saint Antoine', type: 'Paroisse', phone: '+228 90 45 67 89', city: 'Lomé' },
      { name: 'Communauté des Sœurs Dominicaines', type: 'Communauté religieuse', phone: '+228 99 88 77 66', city: 'Atakpamé' },
      { name: 'Groupe de prière Emmanuel', type: 'Groupe de prière', phone: '+228 93 21 54 87', city: 'Sokodé' },
      { name: 'Librairie catholique Saint-Pierre', type: 'Librairie', phone: '+228 98 76 54 32', city: 'Kara' },
    ],
  });

  console.log('✅ Données de seed générées avec succès.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

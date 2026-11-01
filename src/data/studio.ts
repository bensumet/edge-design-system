// Sample content for the demo. The leather goods and paintings are the
// author's own work; product names, prices and orders are illustrative.

import type { EdgeName } from '../tokens/tokens';

export const img = (path: string) => `${import.meta.env.BASE_URL}images/${path}`;

export interface Piece {
  id: string;
  name: string;
  kind: 'Bifold wallet' | 'Card holder' | 'Card pouch' | 'Flap wallet' | 'Bag';
  leather: string;
  edge: string;
  edgeToken?: EdgeName;
  price: number;
  status: 'Available' | 'Made to order' | 'Sold';
  image: string;
  alt: string;
}

export const pieces: Piece[] = [
  {
    id: 'w-01', name: 'Navy bifold', kind: 'Bifold wallet', leather: 'Navy', edge: 'Orange', edgeToken: 'orange',
    price: 180, status: 'Available', image: img('leather/navy-bifold-orange-interior.jpg'),
    alt: 'Open navy bifold wallet with angled card slots outlined in orange stitching, orange edges and a brass snap pocket',
  },
  {
    id: 'w-02', name: 'Navy bifold, electric edge', kind: 'Bifold wallet', leather: 'Navy', edge: 'Electric blue', edgeToken: 'blue',
    price: 180, status: 'Made to order', image: img('leather/navy-bifold-blue.jpg'),
    alt: 'Open navy bifold wallet with electric blue edges beside a tin of leather balm and glasses',
  },
  {
    id: 'w-03', name: 'Bifold, mint edge', kind: 'Bifold wallet', leather: 'Dark brown', edge: 'Mint', edgeToken: 'mint',
    price: 175, status: 'Sold', image: img('leather/navy-bifold-mint.jpg'),
    alt: 'Open dark brown bifold wallet standing upright, with mint green painted edges and a card in one slot',
  },
  {
    id: 'c-01', name: 'Slim card holder', kind: 'Card holder', leather: 'Navy', edge: 'Purple', edgeToken: 'purple',
    price: 85, status: 'Available', image: img('leather/navy-card-holder-purple.jpg'),
    alt: 'Slim navy card holder with purple edges and a small embossed maker’s mark',
  },
  {
    id: 'f-01', name: 'Snap flap wallet', kind: 'Flap wallet', leather: 'Chocolate', edge: 'Mint', edgeToken: 'mint',
    price: 120, status: 'Available', image: img('leather/brown-flap-wallet-mint.jpg'),
    alt: 'Dark brown flap wallet with a brass snap and mint green edges',
  },
  {
    id: 'p-01', name: 'Oxblood card pouch', kind: 'Card pouch', leather: 'Oxblood', edge: 'Natural', price: 95,
    status: 'Made to order', image: img('leather/oxblood-card-pouch.jpg'),
    alt: 'Oxblood red leather card pouch on a cutting mat',
  },
  {
    id: 'b-01', name: 'Oxblood crossbody', kind: 'Bag', leather: 'Oxblood', edge: 'Natural', price: 340,
    status: 'Sold', image: img('leather/oxblood-crossbody.jpg'),
    alt: 'Small oxblood leather crossbody bag with a buckled strap and hand stitching',
  },
  {
    id: 'w-04', name: 'Black bifold with mark', kind: 'Bifold wallet', leather: 'Black', edge: 'Black', price: 170,
    status: 'Available', image: img('leather/black-bifold-mark.jpg'),
    alt: 'Closed black leather bifold wallet with a gold maker’s mark in the corner',
  },
];

export interface Painting {
  id: string;
  title: string;
  series: 'Studies on paper' | 'Night studio';
  image: string;
  alt: string;
}

export const paintings: Painting[] = [
  { id: 'pt-01', title: 'Rose in a bottle', series: 'Night studio', image: img('paintings/rose-in-vase.jpg'), alt: 'A single pink rose in a clear glass bottle, lit by a slanted beam of light on a dusky rose wall' },
  { id: 'pt-02', title: 'Latte', series: 'Night studio', image: img('paintings/latte.jpg'), alt: 'A latte with a heart in the foam, in a blue cup and saucer against a deep indigo background' },
  { id: 'pt-03', title: 'Red pour', series: 'Night studio', image: img('paintings/wine-glass.jpg'), alt: 'Red wine pouring into a tall glass against a deep red background' },
  { id: 'pt-04', title: 'Magnolia bud', series: 'Night studio', image: img('paintings/magnolia.jpg'), alt: 'A purple magnolia bud on a bare branch against a soft magenta background' },
  { id: 'pt-05', title: 'Orange rose', series: 'Night studio', image: img('paintings/orange-rose.jpg'), alt: 'Close-up of an orange rose in warm, painterly strokes, matted on pale pink' },
  { id: 'pt-06', title: 'Peach', series: 'Studies on paper', image: img('paintings/peach.jpg'), alt: 'A ripe peach with one green leaf on textured white paper' },
  { id: 'pt-07', title: 'Raspberry', series: 'Studies on paper', image: img('paintings/raspberry.jpg'), alt: 'A single detailed raspberry with its green calyx on textured white paper' },
  { id: 'pt-08', title: 'Tulip', series: 'Studies on paper', image: img('paintings/tulip.jpg'), alt: 'A coral pink tulip on a short stem against white' },
  { id: 'pt-09', title: 'Pink rose', series: 'Studies on paper', image: img('paintings/pink-rose.jpg'), alt: 'A soft pink open rose seen from above on textured white paper' },
  { id: 'pt-10', title: 'Red apple', series: 'Studies on paper', image: img('paintings/apple.jpg'), alt: 'A glossy red apple with a green leaf on textured white paper' },
];

export interface Commission {
  id: string;
  client: string;
  item: string;
  edge: string;
  due: string;
  stage: 'Design' | 'Cutting' | 'Stitching' | 'Edge finishing' | 'Ready';
}

export const commissions: Commission[] = [
  { id: 'CM-1042', client: 'A. Rivera', item: 'Bifold wallet', edge: 'Orange', due: '2026-11-08', stage: 'Edge finishing' },
  { id: 'CM-1043', client: 'J. Park', item: 'Slim card holder', edge: 'Purple', due: '2026-11-12', stage: 'Stitching' },
  { id: 'CM-1044', client: 'M. Okafor', item: 'Crossbody bag', edge: 'Natural', due: '2026-11-22', stage: 'Cutting' },
  { id: 'CM-1045', client: 'L. Chen', item: 'Rose in a bottle, print', edge: '—', due: '2026-11-05', stage: 'Ready' },
  { id: 'CM-1046', client: 'S. Novak', item: 'Snap flap wallet', edge: 'Mint', due: '2026-12-01', stage: 'Design' },
];

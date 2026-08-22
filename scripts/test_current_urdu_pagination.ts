import { paginateStory } from '../src/services/storybookPagination'

const urdu21Sentences = `ایک دفعہ کا ذکر ہے کہ ایک چھوٹے سے گاؤں میں ایک بچہ رہتا تھا۔ اس کا نام علی تھا۔ وہ بہت ذہین اور محنتی تھا۔ علی کو کہانیاں پڑھنے کا بہت شوق تھا۔ وہ ہر روز شام کو اپنے دادا جی سے نئی کہانی سنتا تھا۔ دادا جی اسے بہادری اور سچائی کے قصے سناتے تھے۔ ایک دن علی نے جنگل میں ایک چھوٹا پرندہ دیکھا۔ پرندہ زخمی تھا اور اڑ نہیں سکتا تھا۔ علی نے نرمی سے پرندے کو اپنے ہاتھ میں اٹھایا۔ وہ اسے گھر لے آیا اور اس کے زخم پر مرہم لگایا۔ چند دنوں میں پرندہ بالکل ٹھیک ہو گیا۔ پرندے نے خوشی سے اپنے پر پھڑپھڑائے اور چہچہانے لگا۔ علی نے اسے کھلی کھڑکی سے آزاد کر دیا۔ پرندہ اڑ کر پاس کے درخت پر بیٹھ گیا۔ اس نے علی کی طرف دیکھ کر شکریہ کا گیت گایا۔ علی کے دل کو بہت خوشی اور سکون ملا۔ دادا جی نے علی کی پیٹھ تھپتھپائی اور شاباش دی۔ انہوں نے کہا کہ بے زبان جانوروں پر رحم کرنا سب سے بڑی نیکی ہے۔ علی نے وعدہ کیا کہ وہ ہمیشہ کمزوروں اور ضرورت مندوں کی مدد کرے گا۔ اس دن سے علی پورے گاؤں میں اپنی رحم دلی کی وجہ سے مشہور ہو گیا۔`

console.log('--- Testing Current paginateStory with 21-Sentence Single Paragraph Urdu Story ---')
const res = paginateStory('Urdu Story', urdu21Sentences, 'short')
console.log(`Input length: ${urdu21Sentences.length} chars`)
console.log(`Result pages count: ${res.pages.length}`)
res.pages.forEach((p) => {
  console.log(`Page ${p.pageNumber}: length=${p.text.length} chars`)
  console.log(`Text preview: ${p.text.slice(0, 60)}...`)
})

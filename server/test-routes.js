/**
 * Test script to debug Delhi → Goa route generation
 */
import { planTrip } from './tripAgent.js';

const testPayload = {
  origin: 'Delhi',
  destination: 'Goa',
  startDate: '2025-12-01',
  endDate: '2025-12-04',
  preferences: { budget: 'moderate', travelStyle: 'balanced' }
};

console.log('Testing route generation: Delhi → Goa\n');
console.log('Input:', JSON.stringify(testPayload, null, 2));
console.log('\n' + '='.repeat(60) + '\n');

planTrip(testPayload)
  .then(result => {
    console.log('RESULT SOURCE:', result.source);
    console.log('\n' + '='.repeat(60) + '\n');
    
    if (result.plan) {
      console.log('PLAN STRUCTURE:');
      console.log('- route.legs:', result.plan.route?.legs?.length || 0, 'legs');
      
      if (result.plan.route?.legs) {
        console.log('\nROUTE LEGS DETAILS:');
        result.plan.route.legs.forEach((leg, idx) => {
          console.log(`\nLeg ${idx + 1}:`);
          console.log(`  Mode: ${leg.mode || 'N/A'}`);
          console.log(`  From: ${leg.from?.city || leg.from || 'N/A'}`);
          console.log(`  To: ${leg.to?.city || leg.to || 'N/A'}`);
          console.log(`  Duration: ${leg.durationMinutes || 'N/A'} min`);
          console.log(`  Price: ₹${leg.priceINR || 'N/A'}`);
        });
      }
      
      console.log('\n' + '='.repeat(60) + '\n');
      console.log('FULL PLAN:');
      console.log(JSON.stringify(result.plan, null, 2));
    }
    
    if (result.rawGeminiResponse) {
      console.log('\n' + '='.repeat(60) + '\n');
      console.log('RAW GEMINI TEXT:');
      const geminiText = result.rawGeminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || 'No text';
      console.log(geminiText.substring(0, 1000)); // First 1000 chars
    }
  })
  .catch(err => {
    console.error('ERROR:', err.message);
    console.error(err.stack);
  });

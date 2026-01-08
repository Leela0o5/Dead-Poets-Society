import { Scroll, Shield, Heart, AlertTriangle } from 'lucide-react';

const Rules = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="bg-amber-100 p-4 rounded-full text-amber-800">
            <Scroll size={48} />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 font-serif mb-4">The Society Code</h1>
        <p className="text-lg text-gray-600 italic">
          "Words and ideas can change the world. Use them wisely."
        </p>
      </div>

      {/* Rules List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Rule 1 */}
        <div className="p-8 border-b border-gray-100 hover:bg-gray-50 transition">
          <div className="flex gap-4">
            <Heart className="text-red-500 shrink-0 mt-1" size={24} />
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">1. Be Kind & Constructive</h3>
              <p className="text-gray-600 leading-relaxed">
                Poetry is vulnerable. When critiquing work, critique the poem, not the poet. 
                Harassment, hate speech, or bullying of any kind will result in immediate banishment.
              </p>
            </div>
          </div>
        </div>

        {/* Rule 2 */}
        <div className="p-8 border-b border-gray-100 hover:bg-gray-50 transition">
          <div className="flex gap-4">
            <Shield className="text-blue-500 shrink-0 mt-1" size={24} />
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">2. Original Work Only</h3>
              <p className="text-gray-600 leading-relaxed">
                Plagiarism is the highest offense. Only post poems that you have written yourself. 
                If you are sharing a classic poem for discussion, clearly credit the original author.
              </p>
            </div>
          </div>
        </div>

        {/* Rule 3 */}
        <div className="p-8 border-b border-gray-100 hover:bg-gray-50 transition">
          <div className="flex gap-4">
            <AlertTriangle className="text-yellow-500 shrink-0 mt-1" size={24} />
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">3. Respect Privacy</h3>
              <p className="text-gray-600 leading-relaxed">
                Do not share personal information (yours or others) in public poems or comments. 
                Keep the society safe for everyone.
              </p>
            </div>
          </div>
        </div>

        {/* Rule 4 */}
        <div className="p-8 hover:bg-gray-50 transition">
          <div className="flex gap-4">
            <Scroll className="text-gray-500 shrink-0 mt-1" size={24} />
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">4. No Spam</h3>
              <p className="text-gray-600 leading-relaxed">
                Do not use poems to sell products, promote scams, or flood the feed with repetitive content.
                Let the art breathe.
              </p>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        By using Dead Poets Society, you agree to abide by these rules.
      </div>
    </div>
  );
};

export default Rules;
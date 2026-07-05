import { ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function TermsAndConditions() {
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-16 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-600 mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-150">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-gray-950 mb-8">
            Terms and Conditions
          </h1>
          
          <div className="prose prose-stone max-w-none text-gray-600 space-y-6">
            <p>
              Welcome to Rozay Kitchen! By using our website <a href="mailto:rozaykitchen@gmail.com" className="text-brand-600 hover:underline font-bold">rozaykitchen@gmail.com</a>, you agree to the following terms:
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Use of the Website</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You must be at least 18 years old or have parental permission to shop on our site.</li>
              <li>All information provided must be accurate and complete.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Product Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>We aim to display product details and images as accurately as possible.</li>
              <li>Prices, availability, and descriptions are subject to change without notice.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Orders &amp; Payments</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Orders are confirmed only after successful payment.</li>
              <li>We accept secure online payments through our listed payment methods Paystack <a href="https://paystack.com/" className="text-brand-600 hover:underline font-bold" target="_blank" rel="noopener noreferrer">https://paystack.com/</a></li>
              <li>We reserve the right to cancel or refuse any order at our discretion.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Shipping &amp; Delivery</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Delivery timelines are clearly stated during checkout (Lagos: 1–3 days | Outside Lagos: 3–10 days).</li>
              <li>Lagos Delivery - 1-3 working days</li>
              <li>Outside Lagos - 3-5 working days</li>
              <li>We are not responsible for delays caused by third-party couriers.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Returns &amp; Refunds</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Due to the nature of our skincare products, returns are accepted only if items are damaged or incorrect.</li>
              <li>Claims must be made within 48 hours of receiving the order.</li>
              <li>For More details, check <Link to="/refund-policy" className="text-brand-600 hover:underline font-bold">Refunds &amp; Returns Policy</Link></li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Privacy</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Your personal information is protected and only used to process your order.</li>
              <li>We do not share your data with third parties without your consent.</li>
              <li>For More details, check <Link to="/privacy-policy" className="text-brand-600 hover:underline font-bold">Privacy Policy</Link></li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Changes to Terms</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>We may update these terms occasionally. Continued use of the site means you accept any updates.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Need Help?</h2>
            <p>
              If you have any questions about our Terms and Conditions, please feel free to contact us at <a href="mailto:rozaykitchen@gmail.com" className="text-brand-600 hover:underline font-bold">rozaykitchen@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

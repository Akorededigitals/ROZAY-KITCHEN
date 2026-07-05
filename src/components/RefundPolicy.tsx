import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RefundPolicy() {
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
            Refund and Returns Policy
          </h1>
          
          <div className="prose prose-stone max-w-none text-gray-600 space-y-6">
            <p>
              At ROZAY KITCHEN, your satisfaction is important to us. Due to the nature of our products, we do not offer refunds or accept returns except in the case of damaged (upon delivery) or lost parcels.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Overview</h2>
            <p>
              You can inform us of your decision by e-mail <a href="mailto:rozaykitchen@gmail.com" className="text-brand-600 hover:underline font-bold">rozaykitchen@gmail.com</a>
            </p>
            <p>
              We will reimburse you no later than 30 days from the day on which we receive the returned goods. We will use the same means of payment as you used for the order, and you will not incur any fees for such reimbursement.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Conditions for returns:</h2>
            
            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Damaged Items</h3>
            <p>If your order arrives damaged:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Do not accept the package from the delivery personnel.</li>
              <li>Contact us within 24 hours via email at <a href="mailto:rozaykitchen@gmail.com" className="text-brand-600 hover:underline font-bold">rozaykitchen@gmail.com</a> or WhatsApp with photos of the damaged item.</li>
              <li>Items must be unused, in their original condition and packaging, and accompanied by proof of purchase.</li>
            </ul>

            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Lost Parcels</h3>
            <p>If your parcel is lost in transit:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>We will inform you as soon as we’re made aware.</li>
              <li>If the issue is not resolved within 5 working days, a full refund will be issued to your bank account.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Refunds (If approved)</h2>
            <p>
              Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund by email.
            </p>
            <p>
              If you are approved, then your refund will be processed, Refunds will be processed to your original payment method or bank account within a few business days.
            </p>

            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Late or missing refunds</h3>
            <p>If you haven’t received your refund:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Check your bank or mobile wallet again.</li>
              <li>Contact your payment provider — it may take some time to reflect.</li>
              <li>If still unresolved, contact us at <a href="mailto:rozaykitchen@gmail.com" className="text-brand-600 hover:underline font-bold">rozaykitchen@gmail.com</a>.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Exchanges</h2>
            <p>
              We only exchange items if they are defective or damaged. If you need an exchange for the same product, reach out to us via email.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Note</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Sale items are final and cannot be refunded.</li>
              <li>Gift returns will be handled as store credit or refunds based on how the order was placed.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Need help?</h2>
            <p>
              If you have any questions about our Returns and Refunds Policy, please contact us by e-mail <a href="mailto:rozaykitchen@gmail.com" className="text-brand-600 hover:underline font-bold">rozaykitchen@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

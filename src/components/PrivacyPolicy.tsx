import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          
          <div className="prose prose-stone max-w-none text-gray-600 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Who we are</h2>
            <p>Our website address is: <a href="https://rozaykitchen.com.ng" className="text-brand-600 hover:underline font-bold">https://rozaykitchen.com.ng</a></p>
            <p>rozaykitchen website is owned by Rozay Kitchen, which is a data controller of your personal data.</p>
            <p>We have adopted this Privacy Policy, which determines how we are processing the information collected by Rozay Kitchen, which also provides the reasons why we must collect certain personal data about you. Therefore, you must read this Privacy Policy before using Rozay Kitchen website.</p>
            <p>We take care of your personal data and undertake to guarantee its confidentiality and security.</p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Personal information we collect:</h2>
            <p>When you visit the Rozay Kitchen, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the installed cookies on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products you view, what websites or search terms referred you to the Site, and how you interact with the Site. We refer to this automatically-collected information as &quot;Device Information.&quot; Moreover, we might collect the personal data you provide to us (including but not limited to Name, Surname, Address, payment information, etc.) during registration to be able to fulfill the agreement.</p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Why do we process your data?</h2>
            <p>Our top priority is customer data security, and, as such, we may process only minimal user data, only as much as it is absolutely necessary to maintain the website. Information collected automatically is used only to identify potential cases of abuse and establish statistical information regarding website usage. This statistical information is not otherwise aggregated in such a way that it would identify any particular user of the system.</p>
            <p>You can visit the website without telling us who you are or revealing any information, by which someone could identify you as a specific, identifiable individual. If, however, you wish to use some of the website&apos;s features, or you wish to receive our newsletter or provide other details by filling a form, you may provide personal data to us, such as your email, first name, last name, city of residence, organization, telephone number. You can choose not to provide us with your personal data, but then you may not be able to take advantage of some of the website&apos;s features. For example, you won&apos;t be able to receive our Newsletter or contact us directly from the website. Users who are uncertain about what information is mandatory are welcome to contact us via <a href="mailto:ballycosmetics@gmail.com" className="text-brand-600 hover:underline font-bold">ballycosmetics@gmail.com</a>.</p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Your rights:</h2>
            <p>You have the following rights related to your personal data:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>The right to be informed.</li>
              <li>The right of access.</li>
              <li>The right to rectification.</li>
              <li>The right to erasure.</li>
              <li>The right to restrict processing.</li>
              <li>The right to data portability.</li>
              <li>The right to object.</li>
              <li>Rights in relation to automated decision-making and profiling.</li>
            </ul>
            <p>If you would like to exercise this right, please contact us through the contact information below.</p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Links to other websites:</h2>
            <p>Our website may contain links to other websites that are not owned or controlled by us. Please be aware that we are not responsible for such other websites or third parties&apos; privacy practices. We encourage you to be aware when you leave our website and read the privacy statements of each website that may collect personal information.</p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Information security:</h2>
            <p>We secure information you provide on computer servers in a controlled, secure environment, protected from unauthorized access, use, or disclosure. We keep reasonable administrative, technical, and physical safeguards to protect against unauthorized access, use, modification, and personal data disclosure in its control and custody. However, no data transmission over the Internet or wireless network can be guaranteed.</p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Legal disclosure:</h2>
            <p>We will disclose any information we collect, use or receive if required or permitted by law, such as to comply with a subpoena or similar legal process, and when we believe in good faith that disclosure is necessary to protect our rights, protect your safety or the safety of others, investigate fraud, or respond to a government request.</p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Need Help?</h2>
            <p>If you would like to contact us to understand more about this Policy or wish to contact us concerning any matter relating to individual rights and your Personal Information, you may send an email to <a href="mailto:rozaykitchen@gmail.com" className="text-brand-600 hover:underline font-bold">rozaykitchen@gmail.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

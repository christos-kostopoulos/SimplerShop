import React from 'react';

const Footer: React.FC = () => (
  <footer className="bg-gray-800 text-white py-8 mt-12">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="mb-6 md:mb-0">
          <h2 className="text-xl font-bold mb-4">SimplerCart</h2>
          <p className="text-gray-400">Your one-stop shop for all your needs.</p>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Home
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>123 Shopping St.</li>
              <li>Cartville, CV 12345</li>
              <li>info@SimplerCart.com</li>
              <li>(123) 456-7890</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} SimplerCart. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-28">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
            Welcome to Estate-King 
          </h1>
          <p className="text-lg sm:text-xl mb-6 max-w-3xl mx-auto">
            Discover your dream property with us. We offer a wide range of real estate services tailored to your needs.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-indigo-600 font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition duration-300"
          >
            Contact Us
          </Link>
        </div>
      </section>

      {/* About the Company Section */}
      <section className="py-16 bg-white text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">About Estate-King</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
          At  Estate-King, our mission is to make your real estate journey as seamless and stress-free as possible. We specialize in helping individuals and families find their perfect homes.
        </p>
        <div className="flex justify-center gap-16 flex-wrap">
          <div className="w-full sm:w-1/2 lg:w-1/3">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Mission</h3>
            <p className="text-gray-600">
              We aim to deliver an unparalleled customer experience while helping you buy, rent, or sell real estate. Our approach is centered around integrity and exceptional service.
            </p>
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/3">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Vision</h3>
            <p className="text-gray-600">
              To be the leading real estate agency in the region by creating lasting relationships and providing innovative solutions that cater to your every need.
            </p>
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/3">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Values</h3>
            <ul className="list-disc pl-5 text-gray-600">
              <li>Customer-Centric</li>
              <li>Transparency</li>
              <li>Innovation</li>
              <li>Integrity</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 text-center bg-indigo-600 text-white">
        <h2 className="text-3xl font-semibold mb-4">Want to Get in Touch?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          We would love to hear from you! If you have any questions or need assistance, don’t hesitate to contact us.
        </p>
        <Link
          to="/contact"
          className="inline-block bg-white text-indigo-600 font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-indigo-700 hover:text-white transition duration-300"
        >
          Get In Touch
        </Link>
      </section>
    </div>
  );
};

export default About;

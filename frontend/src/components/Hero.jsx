import React from 'react';

const Hero = () => {
  return (
    <section className="relative bg-white dark:bg-black transition-colors duration-300">
      <div className="container mx-auto px-4 py-17 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 w-full text-gray-900 dark:text-white">
            Treat yourself<br />
            with beautiful,<br />
            <span className="text-[#c36] dark:text-pink-400">white</span> smile.
          </h1>

          <div className="flex space-x-8 mt-8">
            <div>
              <h3 className="text-[#c36] dark:text-pink-400 font-bold">01.</h3>
              <p className="font-medium text-gray-900 dark:text-white">Preventive Care</p>
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#c36] dark:hover:text-pink-400">Learn More →</a>
            </div>

            <div>
              <h3 className="text-[#c36] dark:text-pink-400 font-bold">02.</h3>
              <p className="font-medium text-gray-900 dark:text-white">Restorative Care</p>
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#c36] dark:hover:text-pink-400">Learn More →</a>
            </div>

            <div>
              <h3 className="text-[#c36] dark:text-pink-400 font-bold">03.</h3>
              <p className="font-medium text-gray-900 dark:text-white">Cosmetic Dentistry</p>
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#c36] dark:hover:text-pink-400">Learn More →</a>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 mt-8 md:mt-0">
          <img
            src="/hero-image-babar.png"
            alt="Dr. Babar holding ClearPath Aligner"
            className="rounded w-full"
          />
        </div>


      </div>
    </section>
  );
};

export default Hero;
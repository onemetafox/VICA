import React from 'react';
import Image from 'next/image';
import image2 from 'src/assets/images/buy_sell_2.png';
import image3 from 'src/assets/images/buy_sell_3.png';
import image4 from 'src/assets/images/buy_sell_4.png';

const Advantages = () => (
  <div className="grid grid-cols-3 gap-28 lg:gap- ed:grid-cols-1 ed:gap-10 sm:items-center sm:content-center sm:place-items-center sm:w-2/3">
    <div className="sm:flex flex-col sm: justify-center sm:items-center">
      <Image src={image2} alt="buy-sell-1" width={282} />
      <h1 className="font-bold text-darkBlack my-3 sm:text-center">
        24/7 Customer Services
      </h1>
      <p className="text-xs text-gray-700 text-justify sm:text-center">
        We provide 24/7 online services for tens of millions of users in over
        170 countries. You will always have our support when encountering any
        problems on the platform.
      </p>
    </div>
    <div className="sm:flex flex-col sm: justify-center sm:items-center">
      <Image src={image3} alt="buy-sell-1" width={282} height={136} />
      <h1 className="font-bold text-darkBlack my-3 sm:text-center">
        Anti-fraud Practitioner
      </h1>
      <p className="text-xs text-gray-700 text-justify sm:text-center">
        Up to 59 popular local payment methods are available for you. On our
        platform, you can also quickly buy/sell crypto with just one click,
        making your transactions more convenient.
      </p>
    </div>
    <div className="sm:flex flex-col sm: justify-center sm:items-center">
      <Image src={image4} alt="buy-sell-1" />
      <h1 className="font-bold text-darkBlack my-3 sm:text-center">
        Highest Priority to Transaction Safety
      </h1>
      <p className="text-xs text-gray-700 text-justify sm:text-center">
        The platform will automatically scan every transaction and detect
        suspicious transactions. In addition, certified Advertiser Verification
        and Facial Recognition are implemented to make your transactions more
        secure.
      </p>
    </div>
  </div>
);

export default Advantages;
